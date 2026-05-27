<?php

declare(strict_types=1);

namespace HiEvents\DomainObjects\Status;

enum MarketingSubscriberStatus: string
{
    case ACTIVE = 'active';
    case UNSUBSCRIBED = 'unsubscribed';
    case SUPPRESSED = 'suppressed';
    case PENDING_CONFIRMATION = 'pending_confirmation';
}
