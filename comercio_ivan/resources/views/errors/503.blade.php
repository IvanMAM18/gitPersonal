@extends('layouts.app')
@section('content')
    <div class="flex items-center md:justify-center h-full w-full bg-gray-100 flex-col w-full p-12">
        <div class="md:max-w-lg text-center mb-3">
            <div class="mb-12">
                <img class="max-w-52 md:max-w-80 mx-auto" src="{{ asset('/imagenes/ESCUDO_color.png') }}" alt="{{ config('app.name') }}">
                <div class="font-medium text-lg text-gray-700">
                    <div>Ayuntamiento de la Paz</div>
                </div>
            </div>
           <div class="md:text-lg xl:text-xl font-medium text-gray-500">
               <div>Estamos dando mantenimiento a la aplicación para brindarte un mejor servicio.</div>
           </div>
        </div>
        <a class="bg-red-800 rounded text-white font-medium px-3 py-2 hover:bg-red-900" href="{{ url('/') }}">Probar de Nuevo</a>
    </div>
@endsection
