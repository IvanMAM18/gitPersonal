<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    <title>Registrarse - {{ config('app.name') }}</title>
</head>
<body class="min-w-full min-h-full">
<div class="w-full h-full" id="register-root"></div>
</body>
</html>
