<?php

declare(strict_types=1);

namespace HiEvents\Repository\Interfaces;

use HiEvents\DomainObjects\MarketingSuppressionDomainObject;
use Illuminate\Support\Collection;

/**
 * @extends RepositoryInterface<MarketingSuppressionDomainObject>
 */
interface MarketingSuppressionRepositoryInterface extends RepositoryInterface
{
    public function findByEmail(string $email, ?int $accountId = null): Collection;
}
