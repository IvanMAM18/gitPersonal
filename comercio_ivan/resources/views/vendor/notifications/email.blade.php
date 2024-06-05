@component('mail::message')
{{-- Greeting --}}
<div>
    <div style="width:100px;">
        <img src="https://comercio.lapaz.gob.mx/imagenes/ESCUDO_color.png" alt="{{ config('app.name') }}"  style="width:100%;max-width:100px;"/>
    </div>
    <div style="width:calc(100% - 120px); margin-left:15px;">
        @if (! empty($greeting))
        {{ $greeting }}
        @else
    </div>
</div>


@if ($level === 'error')
# @lang('Whoops!')
@else
# @lang('Hello!')
@endif
@endif

{{-- Intro Lines --}}
@foreach ($introLines as $line)
{{ $line }}

@endforeach

{{-- Action Button --}}
@isset($actionText)
<?php
    switch ($level) {
        case 'success':
        case 'error':
            $color = $level;
            break;
        default:
            $color = 'primary';
    }
?>
@component('mail::button', ['url' => $actionUrl, 'color' => $color])
{{ $actionText }}
@endcomponent
@endisset

{{-- Outro Lines --}}
@foreach ($outroLines as $line)
{{ $line }}

@endforeach

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
@lang('Regards'),<br>
{{ config('app.name') }}
@endif

{{-- Subcopy --}}
@isset($actionText)
@slot('subcopy')
@lang(
    "Si tienes problemas dandole click al botón \":actionText\", copia y pega el URL debajo\n".
    'a tu explorador web:',
    [
        'actionText' => $actionText,
    ]
) <span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>
@endslot
@endisset
@endcomponent
