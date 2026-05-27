<?php

declare(strict_types=1);

namespace HiEvents\Repository\Eloquent;

use HiEvents\DomainObjects\MarketingConsentAuditDomainObject;
use HiEvents\Models\MarketingConsentAudit;
use HiEvents\Repository\Interfaces\MarketingConsentAuditRepositoryInterface;

/**
 * @extends BaseRepository<MarketingConsentAuditDomainObject>
 */
class MarketingConsentAuditRepository extends BaseRepository implements MarketingConsentAuditRepositoryInterface
{
    protected function getModel(): string
    {
        return MarketingConsentAudit::class;
    }

    public function getDomainObject(): string
    {
        return MarketingConsentAuditDomainObject::class;
    }
}
