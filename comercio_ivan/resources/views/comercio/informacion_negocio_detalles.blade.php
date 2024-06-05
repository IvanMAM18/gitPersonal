<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/x-icon" href="{{ asset('/favicon.ico') }}">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <script>
        window.negocio_id = {{ $negocio->id }}
    </script>
    @viteReactRefresh
    @vite(['resources/js/views/NegocioByQrDetailsView.jsx'])
    <title>{{ config('app.name') }}</title>
</head>
<body>
    <div id="informacion_negocio_detalles"></div>
</body>
</html>
