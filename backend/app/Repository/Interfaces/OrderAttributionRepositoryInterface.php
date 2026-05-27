<?php

declare(strict_types=1);

namespace HiEvents\Repository\Interfaces;

use HiEvents\DomainObjects\OrderAttributionDomainObject;

/**
 * @extends RepositoryInterface<OrderAttributionDomainObject>
 */
interface OrderAttributionRepositoryInterface extends RepositoryInterface
{
    public function persist(int $orderId, array $attributionData): OrderAttributionDomainObject;
}
