<?php

declare(strict_types=1);

namespace HiEvents\Models;

class MarketingConsentAudit extends BaseModel
{
    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = null;

    protected function getTimestampsEnabled(): bool
    {
        return false;
    }
}
