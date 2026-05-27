<?php

declare(strict_types=1);

namespace HiEvents\Models;

class OrderAttribution extends BaseModel
{
    protected function getCastMap(): array
    {
        return [
            'utm_raw' => 'array',
        ];
    }
}
