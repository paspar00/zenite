<?php

declare(strict_types=1);

namespace HiEvents\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketingSubscriberSource extends BaseModel
{
    public $timestamps = false;

    protected function getCastMap(): array
    {
        return [];
    }

    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(MarketingSubscriber::class, 'marketing_subscriber_id');
    }
}
