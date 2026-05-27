<?php

declare(strict_types=1);

namespace HiEvents\Resources\Marketing;

use HiEvents\DomainObjects\MarketingSubscriberDomainObject;
use HiEvents\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * @mixin MarketingSubscriberDomainObject
 */
class MarketingSubscriberResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->getId(),
            'account_id' => $this->getAccountId(),
            'email' => $this->getEmail(),
            'first_name' => $this->getFirstName(),
            'last_name' => $this->getLastName(),
            'phone' => $this->getPhone(),
            'locale' => $this->getLocale(),
            'country_code' => $this->getCountryCode(),
            'state' => $this->getState(),
            'city' => $this->getCity(),
            'status' => $this->getStatus(),
            'source' => $this->getSource(),
            'opted_in_at' => $this->getOptedInAt(),
            'opted_out_at' => $this->getOptedOutAt(),
            'last_activity_at' => $this->getLastActivityAt(),
            'tags' => $this->getTags(),
            'created_at' => $this->getCreatedAt(),
            'updated_at' => $this->getUpdatedAt(),
        ];
    }
}
