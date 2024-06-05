<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/x-icon" href="{{ asset('/favicon.ico') }}">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/Administrador/Admin.jsx'])
  <title>{{ config('app.name') }}</title>
</head>
<body>
  <div id="admin_cruds"></div>
</body>
</html>
