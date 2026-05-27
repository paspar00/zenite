@php /** @see \HiEvents\Mail\Marketing\NewEventNearYouMail */ @endphp

<x-mail::message>
# {{ __('New event near you!') }}

{{ $subscriberName ? __('Hello, :name!', ['name' => $subscriberName]) : __('Hello!') }}

{{ __('There is a new event happening near you:') }}

<x-mail::panel>
## {{ $eventTitle }}

@if($eventDate)
**{{ __('Date:') }}** {{ $eventDate }}
@endif
@if($eventLocation)
**{{ __('Location:') }}** {{ $eventLocation }}
@endif
@if($eventDescription)

{{ $eventDescription }}
@endif
</x-mail::panel>

<x-mail::button :url="$eventUrl" color="primary">
{{ __('View event and buy tickets') }}
</x-mail::button>

---

*{{ __('You are receiving this email because you registered on our platform and this event is happening near you.') }}*

[{{ __('Unsubscribe') }}]({{ $unsubscribeUrl }})

</x-mail::message>
