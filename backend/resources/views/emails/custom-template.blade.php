{{-- Custom Liquid Template Wrapper --}}
<x-mail::message>
{!! $renderedBody !!}

@if(isset($renderedCta))
<x-mail::button :url="$renderedCta['url']">
    {{ $renderedCta['label'] }}
</x-mail::button>
@endif

{!! $eventSettings->getGetEmailFooterHtml() !!}

@if(isset($unsubscribeUrl))
<p style="text-align:center;font-size:0.78em;color:#aaa;margin-top:24px;">
    {!! __('Você está recebendo este email porque se cadastrou em nosso evento.') !!}
    <a href="{{ $unsubscribeUrl }}" style="color:#aaa;">{!! __('Cancelar inscrição') !!}</a>
</p>
@endif

</x-mail::message>
