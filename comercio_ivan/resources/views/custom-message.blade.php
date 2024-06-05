<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ config('app.name') }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
{{--    <script>--}}
{{--    window.csrf = '{{ csrf_token() }}'--}}
{{--  </script>--}}
</head>
<body>
  <div style="position:fixed;transform:translate(-50%,-50%);top:50%;left:50%;max-width:400px;text-align:center;">
    <img src="/imagenes/ESCUDO_color.png" alt="Logo" width="200" style="margin-bottom:20px;">
    @if (session('custom_auth_message'))
      <div class="alert alert-success" style="font-family:sans-serif;color:rgb(47, 47, 47);">
        {{ session('custom_auth_message') }}
      </div>
    @endif
  </div>
  <noscript>Este navegador no cumple con los requisitos para utilizar este sistema</noscript>
</body>
</html>
