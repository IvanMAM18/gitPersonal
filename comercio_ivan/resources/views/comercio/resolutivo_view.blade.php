<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name') }} </title>
    <script>
        window.resolutivo_folio ="{{ $resolutivo->folio }}"
    </script>
    @viteReactRefresh
    @vite(['resources/js/views/resolutivos/ResolutivoDetailsView.jsx'])
</head>
<body>
    <div id="resolutivo-details-view"></div>
</body>
</html>
