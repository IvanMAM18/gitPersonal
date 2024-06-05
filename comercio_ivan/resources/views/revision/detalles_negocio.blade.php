@extends('layouts.app')

@section('content')
<div class="container contain">
    <div id="negocios">
        <h1>Negocios</h1>
        <div class="">
            <div id="detalles-negocios-content">

            </div>

            <script src="{{ asset('js/views/revision/detallesNegociosEntidad.js') }}" defer></script>
        </div>
    </div>
</div>
@endsection
