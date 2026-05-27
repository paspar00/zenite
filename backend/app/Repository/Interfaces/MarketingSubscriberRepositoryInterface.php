<?php

declare(strict_types=1);

namespace HiEvents\Repository\Interfaces;

use HiEvents\DomainObjects\MarketingSubscriberDomainObject;
use HiEvents\Services\Domain\Marketing\DTO\UpsertSubscriberData;
use Illuminate\Support\Collection;

/**
 * @extends RepositoryInterface<MarketingSubscriberDomainObject>
 */
interface MarketingSubscriberRepositoryInterface extends RepositoryInterface
{
    public function upsertFromOrder(UpsertSubscriberData $data): MarketingSubscriberDomainObject;

    public function findByEmailAndAccount(string $email, ?int $accountId): ?MarketingSubscriberDomainObject;

    public function findByRegion(string $state, ?string $city, ?int $accountId, int $limit = 500): Collection;

    public function findByRadius(float $lat, float $lng, float $radiusKm, ?int $accountId, int $limit = 500): Collection;

    public function countByRegion(string $state, ?string $city, ?int $accountId): int;

    public function countByRadius(float $lat, float $lng, float $radiusKm, ?int $accountId): int;
}
