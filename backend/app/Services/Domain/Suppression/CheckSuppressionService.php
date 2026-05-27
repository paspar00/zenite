<?php

declare(strict_types=1);

namespace HiEvents\Services\Domain\Suppression;

use HiEvents\Repository\Interfaces\MarketingSuppressionRepositoryInterface;

class CheckSuppressionService
{
    public function __construct(
        private readonly MarketingSuppressionRepositoryInterface $suppressionRepository,
    ) {
    }

    public function isSuppressed(string $email, ?int $accountId = null): bool
    {
        return $this->suppressionRepository->findByEmail($email, $accountId)->isNotEmpty();
    }
}
