@extends('layouts.app')

@section('content')
<div class="h-full w-full flex pt-32 md:pt-0 md:items-center justify-center">

    <div class="h-fit max-w-md">

        <form method="POST" action="{{ route('password.update') }}">
            @csrf

            <input type="hidden" name="token" value="{{ $token }}">

            <img src="/imagenes/ESCUDO_color.png" class="w-64 mx-auto">

            <h1 class="mb-4 text-3xl text-center">Portal de trámites y <br/>servicios en línea</h1>

            <div class="w-100 text-center text-gray-700 mb-5">Restablecer Contraseña</div>

            <div class="mb-2">
                    <input id="email"
                           type="email"
                           class="border w-full text-uppercase text-sm focus:border-red-700 @error('email') border-red-500 @enderror"
                           name="email"
                           value="{{ request()->get('email') ?? old('email') ?? '' }}"
                           required
                           autocomplete="email"
                           autofocus
                           placeholder="Correo Electrónico">

                    @error('email')
                        <div class="text-red-500 text-sm" role="alert">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

            <div class="mb-2">

                <div class="input-group">
                    <input id="password"
                           type="password"
                           class="border w-full text-uppercase text-sm focus:border-red-700 @error('email') border-red-500 @enderror"
                           name="password"
                           required
                           autocomplete="new-password"
                           placeholder="Contraseña">

                    @error('password')
                        <div class="text-red-500 text-sm" role="alert">
                        {{ $message }}
                        </div>
                    @enderror
                </div>
            </div>

            <div class="mb-4">

                <div class="input-group">
                    <input id="password-confirm"
                           type="password"
                           class="border w-full text-uppercase text-sm focus:border-red-700"
                           name="password_confirmation"
                           required
                           autocomplete="new-password"
                           placeholder="Confirmar Contraseña">
                </div>
            </div>

            <div class="mb-2">
                <div class="input-group">
                    <button type="submit" class="text-uppercase bg-app text-white px-3 py-1 w-full">
                        Reestablecer Contraseña
                    </button>
                </div>
            </div>

            <div class="text-center">
                ó <a href="{{ route('login') }}">Iniciar Sesión</a>
            </div>

        </form>

    </div>
</div>
@endsection
