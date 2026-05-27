<?php

declare(strict_types=1);

namespace HiEvents\Mail\Marketing;

use Carbon\Carbon;
use HiEvents\DomainObjects\EventDomainObject;
use HiEvents\Mail\BaseMail;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class NewEventNearYouMail extends BaseMail
{
    public function __construct(
        private readonly EventDomainObject $event,
        private readonly string $subscriberEmail,
        private readonly ?string $subscriberName,
    ) {
        parent::__construct();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            to: $this->subscriberEmail,
            subject: __('New event near you: :title', ['title' => $this->event->getTitle()]),
        );
    }

    public function content(): Content
    {
        $startDate = $this->event->getStartDate();
        $eventDate = $startDate
            ? Carbon::parse($startDate)->isoFormat('dddd, MMMM D, YYYY')
            : null;

        $locationDetails = $this->event->getLocationDetails();
        $locationParts = [];

        if (is_array($locationDetails)) {
            foreach (['venue_name', 'city', 'state', 'country'] as $key) {
                if (!empty($locationDetails[$key])) {
                    $locationParts[] = $locationDetails[$key];
                }
            }
        }

        $locationStr = implode(', ', $locationParts) ?: ($this->event->getLocation() ?? '');

        $description = $this->event->getDescription();
        $plainDescription = $description ? strip_tags($description) : null;
        $shortDesc = $plainDescription
            ? mb_substr($plainDescription, 0, 200) . (mb_strlen($plainDescription) > 200 ? '…' : '')
            : null;

        $eventUrl = $this->event->getEventUrl();

        return new Content(
            markdown: 'emails.marketing.new-event-near-you',
            with: [
                'eventTitle' => $this->event->getTitle(),
                'eventDate' => $eventDate,
                'eventLocation' => $locationStr,
                'eventDescription' => $shortDesc,
                'eventUrl' => $eventUrl,
                'subscriberName' => $this->subscriberName,
                'unsubscribeUrl' => $this->buildUnsubscribeUrl($this->subscriberEmail, $this->event->getAccountId()),
            ],
        );
    }
}
