<?php

declare(strict_types=1);

namespace HiEvents\Jobs\Marketing;

use Carbon\Carbon;
use HiEvents\DomainObjects\Status\EventStatus;
use HiEvents\Mail\Marketing\NewEventNearYouMail;
use HiEvents\Repository\Interfaces\EventRepositoryInterface;
use HiEvents\Services\Domain\Marketing\GeoTargetingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Psr\Log\LoggerInterface;

class SendGeoTargetingCampaignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 300;

    public function __construct(
        private readonly int $eventId,
        private readonly int $accountId,
    ) {
    }

    public function handle(
        EventRepositoryInterface $eventRepository,
        GeoTargetingService $geoTargetingService,
        LoggerInterface $logger,
    ): void {
        $event = $eventRepository->findFirstWhere([
            'id' => $this->eventId,
            'account_id' => $this->accountId,
        ]);

        if ($event === null) {
            return;
        }

        if ($event->getStatus() !== EventStatus::LIVE->name) {
            $logger->info('SendGeoTargetingCampaignJob: skipped — event not live', ['event_id' => $this->eventId]);
            return;
        }

        $startDate = $event->getStartDate();
        if (!$startDate || Carbon::parse($startDate)->lt(now()->addDays(3))) {
            $logger->info('SendGeoTargetingCampaignJob: skipped — event too soon or no date', ['event_id' => $this->eventId]);
            return;
        }

        if ($event->getGeoCampaignSentAt() !== null) {
            $logger->info('SendGeoTargetingCampaignJob: skipped — already sent', ['event_id' => $this->eventId]);
            return;
        }

        // Atomic lock — prevents duplicate sends if job is dispatched twice
        $updated = DB::table('events')
            ->where('id', $this->eventId)
            ->whereNull('geo_campaign_sent_at')
            ->update(['geo_campaign_sent_at' => now()]);

        if ($updated === 0) {
            $logger->info('SendGeoTargetingCampaignJob: skipped — concurrent lock missed', ['event_id' => $this->eventId]);
            return;
        }

        $subscribers = $geoTargetingService->getSubscribersForEvent($this->eventId, $this->accountId);

        if ($subscribers->isEmpty()) {
            $logger->info('SendGeoTargetingCampaignJob: no subscribers found', ['event_id' => $this->eventId]);
            return;
        }

        // Bulk-fetch emails that already have a completed order for this event
        $emails = $subscribers->pluck('email')->map(fn($e) => strtolower($e))->all();

        $alreadyBoughtEmails = DB::table('orders')
            ->where('event_id', $this->eventId)
            ->where('status', 'COMPLETED')
            ->whereIn('email', $emails)
            ->pluck('email')
            ->map(fn($e) => strtolower($e))
            ->flip()
            ->all();

        $cooldownCutoff = now()->subDays(7);
        $sentIds = [];
        $sent = 0;

        foreach ($subscribers as $subscriber) {
            // Skip if emailed within the last 7 days
            $lastSent = $subscriber->getLastGeoEmailSentAt();
            if ($lastSent !== null && Carbon::parse($lastSent)->gt($cooldownCutoff)) {
                continue;
            }

            $email = strtolower($subscriber->getEmail());

            // Skip if already has a ticket (in-memory lookup — no extra DB query)
            if (isset($alreadyBoughtEmails[$email])) {
                continue;
            }

            $firstName = $subscriber->getFirstName();
            $lastName  = $subscriber->getLastName();
            $name      = trim(($firstName ?? '') . ' ' . ($lastName ?? '')) ?: null;

            // Queue each email as a separate job — non-blocking
            Mail::queue(new NewEventNearYouMail($event, $email, $name));

            $sentIds[] = $subscriber->getId();
            $sent++;
        }

        // Batch-update last_geo_email_sent_at in a single query
        if (!empty($sentIds)) {
            DB::table('marketing_subscribers')
                ->whereIn('id', $sentIds)
                ->update(['last_geo_email_sent_at' => now()]);
        }

        $logger->info('SendGeoTargetingCampaignJob: completed', [
            'event_id'    => $this->eventId,
            'total_found' => $subscribers->count(),
            'sent'        => $sent,
        ]);
    }
}
