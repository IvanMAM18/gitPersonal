@extends('layouts.app')
@section('content')
<div class="flex flex-col items-center mt-32 md:mt-0 md:justify-center h-full">

    <div class="max-w-md mx-auto text-center">

        <div class="w-full mx-auto">

            <img class="w-52 mx-auto" src="/imagenes/ESCUDO_color.png" />
            <h1 class="text-center mb-12 text-4xl text-gray-800">Verifica tu dirección de correo</h1>

            @if (session('resent'))
                <div class="bg-green-200 p-2 mb-4 font-medium text-green-700" role="alert">
                    Un nuevo enlace de verificación ha sido enviado a tu dirección de correo.
                </div>
            @endif

            <p class="text-gray-600 mb-4 text-sm">
                Antes de continuar, por favor verifica tu correo para un enlace de verificación.
                Si no recibiste el correo puedes solicitar uno nuevo dando click en el siguiente boton:
            </p>

            <form class="mb-12" method="POST" action="{{ route('verification.resend') }}">
                @csrf
                <button type="submit" class="bg-app text-white px-3 py-1 uppercase"">
                    Solicitar Nuevo Enlace
                </button>
            </form>

            <hr>

            <form class="" method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="bg-gray-600 text-white px-3 py-1 uppercase">
                    Cerrar Sesión
                </button>
            </form>

        </div>

    </div>
</div>
@endsection
