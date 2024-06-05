<!DOCTYPE html>
<html lang="en">

@include('comercio.partials.head')
<title>{{ config('app.name') }} | Mis Negocios</title>
<body>
  @include('comercio.partials.header')
  <div id="app">
    <mis-negocios
      :mis-negocios="{{json_encode($mis_negocios)}}"></mi-negocio>
  </div>
  @include('comercio.partials.footer')
</body>

</html>