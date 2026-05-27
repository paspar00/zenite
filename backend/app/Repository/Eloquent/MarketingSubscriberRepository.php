<?php

declare(strict_types=1);

namespace HiEvents\Repository\Eloquent;

use Carbon\Carbon;
use HiEvents\DomainObjects\MarketingSubscriberDomainObject;
use HiEvents\DomainObjects\Generated\MarketingSubscriberDomainObjectAbstract;
use HiEvents\DomainObjects\Status\MarketingSubscriberStatus;
use HiEvents\Models\MarketingSubscriber;
use HiEvents\Repository\Interfaces\MarketingSubscriberRepositoryInterface;
use HiEvents\Services\Domain\Marketing\DTO\UpsertSubscriberData;
use Illuminate\Support\Collection;

/**
 * @extends BaseRepository<MarketingSubscriberDomainObject>
 */
class MarketingSubscriberRepository extends BaseRepository implements MarketingSubscriberRepositoryInterface
{
    protected function getModel(): string
    {
        return MarketingSubscriber::class;
    }

    public function getDomainObject(): string
    {
        return MarketingSubscriberDomainObject::class;
    }

    public function upsertFromOrder(UpsertSubscriberData $data): MarketingSubscriberDomainObject
    {
        $email = strtolower($data->email);

        $existing = $this->findByEmailAndAccount($email, $data->account_id);

        $attributes = [
            MarketingSubscriberDomainObjectAbstract::EMAIL => $email,
            MarketingSubscriberDomainObjectAbstract::SOURCE => $data->source,
            MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID => $data->account_id,
            MarketingSubscriberDomainObjectAbstract::FIRST_NAME => $data->first_name,
            MarketingSubscriberDomainObjectAbstract::LAST_NAME => $data->last_name,
            MarketingSubscriberDomainObjectAbstract::PHONE => $data->phone,
            MarketingSubscriberDomainObjectAbstract::LOCALE => $data->locale,
            MarketingSubscriberDomainObjectAbstract::COUNTRY_CODE => $data->country_code,
            MarketingSubscriberDomainObjectAbstract::STATE => $data->state,
            MarketingSubscriberDomainObjectAbstract::CITY => $data->city,
            MarketingSubscriberDomainObjectAbstract::LATITUDE => $data->latitude,
            MarketingSubscriberDomainObjectAbstract::LONGITUDE => $data->longitude,
            MarketingSubscriberDomainObjectAbstract::TAGS => $data->tags,
            MarketingSubscriberDomainObjectAbstract::EXTERNAL_ID => $data->external_id,
            MarketingSubscriberDomainObjectAbstract::LAST_ACTIVITY_AT => Carbon::now(),
        ];

        if ($existing === null) {
            $attributes[MarketingSubscriberDomainObjectAbstract::STATUS] = MarketingSubscriberStatus::ACTIVE->value;
            $attributes[MarketingSubscriberDomainObjectAbstract::OPTED_IN_AT] = Carbon::now();

            return $this->create($attributes);
        }

        // Only update status to active if not suppressed/unsubscribed
        if ($existing->getStatus() === MarketingSubscriberStatus::ACTIVE->value) {
            return $this->updateFromArray($existing->getId(), $attributes);
        }

        // Keep existing status, just update activity
        $attributes[MarketingSubscriberDomainObjectAbstract::STATUS] = $existing->getStatus();
        return $this->updateFromArray($existing->getId(), $attributes);
    }

    public function findByEmailAndAccount(string $email, ?int $accountId): ?MarketingSubscriberDomainObject
    {
        $query = $this->model->where(MarketingSubscriberDomainObjectAbstract::EMAIL, strtolower($email));

        if ($accountId !== null) {
            $query->where(MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID, $accountId);
        } else {
            $query->whereNull(MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID);
        }

        return $this->handleSingleResult($query->first());
    }

    public function findByRegion(string $state, ?string $city, ?int $accountId, int $limit = 500): Collection
    {
        return $this->handleResults($this->buildRegionQuery($state, $city, $accountId)->limit($limit)->get());
    }

    public function countByRegion(string $state, ?string $city, ?int $accountId): int
    {
        return $this->buildRegionQuery($state, $city, $accountId)->count();
    }

    private function buildRegionQuery(string $state, ?string $city, ?int $accountId): \Illuminate\Database\Eloquent\Builder
    {
        $query = $this->model
            ->where(MarketingSubscriberDomainObjectAbstract::STATUS, MarketingSubscriberStatus::ACTIVE->value)
            ->where(MarketingSubscriberDomainObjectAbstract::STATE, $state);

        if ($city !== null) {
            $query->where(MarketingSubscriberDomainObjectAbstract::CITY, $city);
        }

        if ($accountId !== null) {
            $query->where(function ($q) use ($accountId) {
                $q->where(MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID, $accountId)
                    ->orWhereNull(MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID);
            });
        } else {
            $query->whereNull(MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID);
        }

        return $query;
    }

    public function findByRadius(float $lat, float $lng, float $radiusKm, ?int $accountId, int $limit = 500): Collection
    {
        return $this->handleResults($this->buildRadiusQuery($lat, $lng, $radiusKm, $accountId)->limit($limit)->get());
    }

    public function countByRadius(float $lat, float $lng, float $radiusKm, ?int $accountId): int
    {
        return $this->buildRadiusQuery($lat, $lng, $radiusKm, $accountId)->count();
    }

    private function buildRadiusQuery(float $lat, float $lng, float $radiusKm, ?int $accountId): \Illuminate\Database\Eloquent\Builder
    {
        $haversine = '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))';

        $query = $this->model
            ->where(MarketingSubscriberDomainObjectAbstract::STATUS, MarketingSubscriberStatus::ACTIVE->value)
            ->whereNotNull(MarketingSubscriberDomainObjectAbstract::LATITUDE)
            ->whereNotNull(MarketingSubscriberDomainObjectAbstract::LONGITUDE)
            ->selectRaw('*, ' . $haversine . ' AS distance', [$lat, $lng, $lat])
            ->havingRaw('distance < ?', [$radiusKm])
            ->orderBy('distance');

        if ($accountId !== null) {
            $query->where(function ($q) use ($accountId) {
                $q->where(MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID, $accountId)
                    ->orWhereNull(MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID);
            });
        } else {
            $query->whereNull(MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID);
        }

        return $query;
    }
}
