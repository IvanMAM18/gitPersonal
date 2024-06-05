<!DOCTYPE html>
<html lang="en">

@include('comercio.partials.head')
<title>{{ config('app.name') }} | Mis Negocios</title>
<body>
  @include('comercio.partials.header')
  <div id="app">
    <detalles-negocio
      :negocio="{{json_encode($negocio)}}"></detalles-negocio>
  </div>
  @include('comercio.partials.footer')
</body>
</html>