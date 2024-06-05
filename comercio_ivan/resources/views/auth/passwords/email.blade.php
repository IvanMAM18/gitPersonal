@extends('layouts.app')

@section('content')
    <div class="h-full w-full flex pt-32 md:pt-0 md:items-center justify-center">

        <div class="h-fit max-w-md">
            <form method="POST" action="{{ route('password.email') }}">
                @csrf

                <img src="/imagenes/ESCUDO_color.png" class="w-64 mx-auto">

                <h1 class="mb-4 text-3xl text-center">Portal de trámites y <br/>servicios en línea</h1>

                <div class="w-100 text-center text-gray-700 mb-5">Solicitar enlace para restablecer Contraseña</div>

                @if (session('status'))
                    <div class="mb-4 bg-green-200 px-3 py-2 text-green-700 font-medium" role="alert">
                        {{ session('status') }}
                    </div>
                @endif

                <div class="mb-2">
                    <div class="input-group">
                        <input id="email"
                               type="email"
                               class="border w-full text-uppercase text-sm focus:border-red-700 @error('email') border-red-500 @enderror"
                               name="email" value="{{ old('email') }}"
                               required autocomplete="email"
                               placeholder="Correo Electrónico"
                               autofocus>
                        @error('email')
                        <div class="text-red-500 text-sm" role="alert">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>
                </div>

                <div class="mb-4 text-center">
                    <button type="submit" class="text-uppercase bg-app text-white px-3 py-1">
                        Enviar Enlace
                    </button>
                </div>

                <div class="text-center">
                    ó <a href="{{ route('login') }}">Iniciar Sesión</a>
                </div>
            </form>
        </div>
    </div>
@endsection
