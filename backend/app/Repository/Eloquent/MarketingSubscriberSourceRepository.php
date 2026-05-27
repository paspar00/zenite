<?php

declare(strict_types=1);

namespace HiEvents\Repository\Eloquent;

use HiEvents\DomainObjects\MarketingSubscriberSourceDomainObject;
use HiEvents\Models\MarketingSubscriberSource;
use HiEvents\Repository\Interfaces\MarketingSubscriberSourceRepositoryInterface;

/**
 * @extends BaseRepository<MarketingSubscriberSourceDomainObject>
 */
class MarketingSubscriberSourceRepository extends BaseRepository implements MarketingSubscriberSourceRepositoryInterface
{
    protected function getModel(): string
    {
        return MarketingSubscriberSource::class;
    }

    public function getDomainObject(): string
    {
        return MarketingSubscriberSourceDomainObject::class;
    }
}
