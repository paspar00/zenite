<?php

declare(strict_types=1);

namespace HiEvents\Services\Application\Handlers\Order;

use HiEvents\Repository\Interfaces\OrderAttributionRepositoryInterface;

class OrderAttributionService
{
    public function __construct(
        private readonly OrderAttributionRepositoryInterface $orderAttributionRepository,
    ) {
    }

    public function persist(int $orderId, array $attributionData): void
    {
        $filtered = array_filter($attributionData, fn($v) => $v !== null);

        if (empty($filtered)) {
            return;
        }

        $this->orderAttributionRepository->persist($orderId, $filtered);
    }
}
