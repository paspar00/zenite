<?php

declare(strict_types=1);

namespace HiEvents\Jobs;

use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use HiEvents\Services\Domain\Marketing\MarketingSubscriberService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncMarketingSubscriberJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        private readonly int $orderId,
        private readonly int $accountId,
    ) {
    }

    public function handle(
        OrderRepositoryInterface $orderRepository,
        MarketingSubscriberService $marketingSubscriberService,
    ): void {
        $order = $orderRepository->findById($this->orderId);
        if ($order === null) {
            return;
        }
        $marketingSubscriberService->syncFromOrder($order, $this->accountId);
    }
}
