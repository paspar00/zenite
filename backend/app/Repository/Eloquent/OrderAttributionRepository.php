<?php

declare(strict_types=1);

namespace HiEvents\Repository\Eloquent;

use HiEvents\DomainObjects\OrderAttributionDomainObject;
use HiEvents\Models\OrderAttribution;
use HiEvents\Repository\Interfaces\OrderAttributionRepositoryInterface;

/**
 * @extends BaseRepository<OrderAttributionDomainObject>
 */
class OrderAttributionRepository extends BaseRepository implements OrderAttributionRepositoryInterface
{
    protected function getModel(): string
    {
        return OrderAttribution::class;
    }

    public function getDomainObject(): string
    {
        return OrderAttributionDomainObject::class;
    }

    public function persist(int $orderId, array $attributionData): OrderAttributionDomainObject
    {
        $existing = $this->findFirstWhere(['order_id' => $orderId]);

        if ($existing !== null) {
            return $this->updateFromArray($existing->getId(), $attributionData);
        }

        return $this->create(array_merge(['order_id' => $orderId], $attributionData));
    }
}
