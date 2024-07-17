<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!--  Title -->
    <title>{{ config('app.name') }}</title>

    <!-- Scripts -->
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
  <title>{{ config('app.name') }}</title>
</head>
<body>
  <div id="preguntas-frecuentes"></div>
</body>
</html>
