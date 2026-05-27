<?php

declare(strict_types=1);

namespace HiEvents\Services\Domain\Marketing;

use HiEvents\DomainObjects\Generated\MarketingSubscriberSourceDomainObjectAbstract;
use HiEvents\DomainObjects\OrderDomainObject;
use HiEvents\Repository\Interfaces\MarketingSubscriberRepositoryInterface;
use HiEvents\Repository\Interfaces\MarketingSubscriberSourceRepositoryInterface;
use HiEvents\Services\Domain\Marketing\DTO\UpsertSubscriberData;
use Illuminate\Support\Facades\Log;
use Throwable;

class MarketingSubscriberService
{
    public function __construct(
        private readonly MarketingSubscriberRepositoryInterface $subscriberRepository,
        private readonly MarketingSubscriberSourceRepositoryInterface $sourceRepository,
    ) {
    }

    public function syncFromRegistration(
        string $email,
        ?string $firstName,
        ?string $lastName,
        ?int $accountId,
        ?string $city,
        ?string $state,
    ): void {
        try {
            if (empty($city) && empty($state)) {
                return;
            }

            $this->subscriberRepository->upsertFromOrder(new UpsertSubscriberData(
                email: strtolower(trim($email)),
                source: 'registration',
                account_id: $accountId,
                first_name: $firstName,
                last_name: $lastName,
                city: $city,
                state: $state ? strtoupper(trim($state)) : null,
            ));
        } catch (\Throwable) {
            // silent — never block registration
        }
    }

    public function syncFromOrder(OrderDomainObject $order, int $accountId, array $attendees = []): void
    {
        if ($order->getOptedIntoMarketingAt() === null) {
            return;
        }

        try {
            $data = new UpsertSubscriberData(
                email: strtolower($order->getEmail()),
                source: 'order_checkout',
                account_id: $accountId,
                first_name: $order->getFirstName(),
                last_name: $order->getLastName(),
                locale: $order->getLocale(),
                order_id: $order->getId(),
                event_id: $order->getEventId(),
                affiliate_id: $order->getAffiliateId(),
            );

            $subscriber = $this->subscriberRepository->upsertFromOrder($data);

            $this->sourceRepository->create([
                MarketingSubscriberSourceDomainObjectAbstract::MARKETING_SUBSCRIBER_ID => $subscriber->getId(),
                MarketingSubscriberSourceDomainObjectAbstract::ORDER_ID => $order->getId(),
                MarketingSubscriberSourceDomainObjectAbstract::EVENT_ID => $order->getEventId(),
                MarketingSubscriberSourceDomainObjectAbstract::AFFILIATE_ID => $order->getAffiliateId(),
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to sync marketing subscriber from order', [
                'order_id' => $order->getId(),
                'error' => $e->getMessage(),
            ]);
        }
    }
}
