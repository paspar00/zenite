<?php

namespace HiEvents\Services\Application\Handlers\Order\DTO;

use HiEvents\DataTransferObjects\BaseDTO;
use Illuminate\Support\Collection;

class CreateOrderPublicDTO extends BaseDTO
{
    public function __construct(
        /**
         * @var Collection<ProductOrderDetailsDTO>
         */
        public readonly Collection $products,
        public readonly bool       $is_user_authenticated,
        public readonly string     $session_identifier,
        public readonly ?string    $order_locale = null,
        public readonly ?string    $promo_code = null,
        public readonly ?string    $affiliate_code = null,
        public readonly ?string    $utm_source = null,
        public readonly ?string    $utm_medium = null,
        public readonly ?string    $utm_campaign = null,
        public readonly ?string    $utm_term = null,
        public readonly ?string    $utm_content = null,
        public readonly ?string    $utm_raw = null,
        public readonly ?string    $referrer_url = null,
        public readonly ?string    $landing_page = null,
        public readonly ?string    $gclid = null,
        public readonly ?string    $fbclid = null,
        public readonly ?string    $attribution_session_id = null,
    )
    {
    }
}
