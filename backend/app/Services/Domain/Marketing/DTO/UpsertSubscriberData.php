<?php

declare(strict_types=1);

namespace HiEvents\Services\Domain\Marketing\DTO;

use HiEvents\DataTransferObjects\BaseDataObject;

class UpsertSubscriberData extends BaseDataObject
{
    public function __construct(
        public readonly string $email,
        public readonly string $source,
        public readonly ?int $account_id = null,
        public readonly ?string $first_name = null,
        public readonly ?string $last_name = null,
        public readonly ?string $phone = null,
        public readonly ?string $locale = null,
        public readonly ?string $country_code = null,
        public readonly ?string $state = null,
        public readonly ?string $city = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly ?array $tags = null,
        public readonly ?string $external_id = null,
        public readonly ?int $order_id = null,
        public readonly ?int $event_id = null,
        public readonly ?int $affiliate_id = null,
    ) {
    }
}
