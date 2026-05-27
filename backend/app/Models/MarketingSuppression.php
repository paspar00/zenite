<?php

declare(strict_types=1);

namespace HiEvents\Models;

class MarketingSuppression extends BaseModel
{
    protected function getCastMap(): array
    {
        return [
            'metadata' => 'array',
        ];
    }
}
