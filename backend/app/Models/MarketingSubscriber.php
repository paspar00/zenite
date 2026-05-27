<?php

declare(strict_types=1);

namespace HiEvents\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MarketingSubscriber extends BaseModel
{
    protected function getCastMap(): array
    {
        return [
            'tags' => 'array',
            'custom_fields' => 'array',
            'opted_in_at' => 'datetime',
            'opted_out_at' => 'datetime',
            'last_activity_at' => 'datetime',
        ];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function sources(): HasMany
    {
        return $this->hasMany(MarketingSubscriberSource::class);
    }
}
