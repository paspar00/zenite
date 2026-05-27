<?php

declare(strict_types=1);

namespace HiEvents\Services\Domain\Marketing;

use HiEvents\Repository\Interfaces\EventRepositoryInterface;
use HiEvents\Repository\Interfaces\MarketingSubscriberRepositoryInterface;
use Illuminate\Support\Collection;

class GeoTargetingService
{
    public function __construct(
        private readonly MarketingSubscriberRepositoryInterface $subscriberRepository,
        private readonly EventRepositoryInterface $eventRepository,
    ) {
    }

    public function getSubscribersForEvent(int $eventId, ?int $accountId, float $radiusKm = 50.0): Collection
    {
        $event = $this->eventRepository->findFirstWhere(['id' => $eventId]);

        if ($event === null) {
            return collect();
        }

        $locationDetails = $event->getLocationDetails();

        $lat = is_array($locationDetails) ? ($locationDetails['lat'] ?? $locationDetails['latitude'] ?? null) : null;
        $lng = is_array($locationDetails) ? ($locationDetails['lng'] ?? $locationDetails['longitude'] ?? null) : null;

        if ($lat !== null && $lng !== null) {
            return $this->subscriberRepository->findByRadius(
                (float) $lat,
                (float) $lng,
                $radiusKm,
                $accountId,
            );
        }

        $state = is_array($locationDetails) ? ($locationDetails['state'] ?? null) : null;
        $city = is_array($locationDetails) ? ($locationDetails['city'] ?? null) : null;

        if ($state !== null) {
            return $this->subscriberRepository->findByRegion($state, $city, $accountId);
        }

        return collect();
    }

    public function getSubscriberCountForEvent(int $eventId, ?int $accountId): int
    {
        $event = $this->eventRepository->findFirstWhere(['id' => $eventId]);

        if ($event === null) {
            return 0;
        }

        $locationDetails = $event->getLocationDetails();

        $lat = is_array($locationDetails) ? ($locationDetails['lat'] ?? $locationDetails['latitude'] ?? null) : null;
        $lng = is_array($locationDetails) ? ($locationDetails['lng'] ?? $locationDetails['longitude'] ?? null) : null;

        if ($lat !== null && $lng !== null) {
            return $this->subscriberRepository->countByRadius((float) $lat, (float) $lng, 50.0, $accountId);
        }

        $state = is_array($locationDetails) ? ($locationDetails['state'] ?? null) : null;
        $city  = is_array($locationDetails) ? ($locationDetails['city'] ?? null) : null;

        if ($state !== null) {
            return $this->subscriberRepository->countByRegion($state, $city, $accountId);
        }

        return 0;
    }

    public function getGeoStatsForEvent(int $eventId, ?int $accountId): array
    {
        $subscribers = $this->getSubscribersForEvent($eventId, $accountId);

        $byCity = $subscribers
            ->filter(fn($s) => $s->getCity() !== null && $s->getState() !== null)
            ->groupBy(fn($s) => $s->getState() . '|' . $s->getCity())
            ->map(fn($group, $key) => [
                'city' => $group->first()->getCity(),
                'state' => $group->first()->getState(),
                'count' => $group->count(),
            ])
            ->values()
            ->sortByDesc('count')
            ->values()
            ->toArray();

        $byState = $subscribers
            ->filter(fn($s) => $s->getState() !== null)
            ->groupBy(fn($s) => $s->getState())
            ->map(fn($group, $state) => [
                'state' => $state,
                'count' => $group->count(),
            ])
            ->values()
            ->sortByDesc('count')
            ->values()
            ->toArray();

        return [
            'total_subscribers' => $subscribers->count(),
            'by_state' => $byState,
            'by_city' => $byCity,
        ];
    }
}
