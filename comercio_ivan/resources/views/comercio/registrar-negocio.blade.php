<!DOCTYPE html>
<html lang="en">

@include('comercio.partials.head')
<title>{{ config('app.name') }} | Registra un negocio</title>
<body>
  @include('comercio.partials.header')
  <div id="app">
    <registrar-negocio
      :giros="{{json_encode($giros)}}"
      :personas-morales="{{json_encode($personas_morales)}}"></registrar-negocio>
  </div>
  @include('comercio.partials.footer')
</body>

</html>