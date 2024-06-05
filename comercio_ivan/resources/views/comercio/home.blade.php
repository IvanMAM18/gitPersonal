<!DOCTYPE html>
<html lang="en">

@include('comercio.partials.head')
<title>{{ config('app.name') }} | Inicio</title>
<body>
  @include('comercio.partials.header')
  <div id="app">
    <inicio></inicio>
  </div>
  @include('comercio.partials.footer')
</body>

</html>