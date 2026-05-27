<?php

declare(strict_types=1);

namespace HiEvents\Repository\Eloquent;

use HiEvents\DomainObjects\MarketingSuppressionDomainObject;
use HiEvents\Models\MarketingSuppression;
use HiEvents\Repository\Interfaces\MarketingSuppressionRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * @extends BaseRepository<MarketingSuppressionDomainObject>
 */
class MarketingSuppressionRepository extends BaseRepository implements MarketingSuppressionRepositoryInterface
{
    protected function getModel(): string
    {
        return MarketingSuppression::class;
    }

    public function getDomainObject(): string
    {
        return MarketingSuppressionDomainObject::class;
    }

    public function findByEmail(string $email, ?int $accountId = null): Collection
    {
        $query = $this->model
            ->where('email', strtolower($email))
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', DB::raw('NOW()'));
            });

        if ($accountId !== null) {
            $query->where(function ($q) use ($accountId) {
                $q->where('account_id', $accountId)
                    ->orWhereNull('account_id');
            });
        } else {
            $query->whereNull('account_id');
        }

        return $this->handleResults($query->get());
    }
}
