<?php

use Illuminate\Support\Facades\Auth;

/**
 * Determina si la applicación esta corriendo en Produccion.
 */
if (! function_exists('isProduction')) {
    function isProduction()
    {
        return app()->environment('production');
    }
}

/**
 * Regresa el usuario actual authenticado en la sesión.
 */
if (! function_exists('currentUser')) {
    function currentUser()
    {
        return Auth::user();
    }
}

/**
 * Oculta algunos caracteres de un correo electronico.
 */
if (! function_exists('censurarCorreo')) {
    function censurarCorreo($correo)
    {
        $correo = strtolower($correo);

        if (! str_contains($correo, '@')) {
            return '';
        }

        // Dividir el correo electrónico en usuario y dominio
        [$usuario, $dominio] = explode('@', $correo);

        // Obtener la longitud del usuario y el dominio
        $longitudUsuario = strlen($usuario);
        $longitudDominio = strlen($dominio);

        // Censurar el usuario (dejar los primeros dos caracteres sin censurar)
        $usuarioCensurado = substr($usuario, 0, 2).str_repeat('*', $longitudUsuario - 2);

        // Censurar el dominio (dejar los primeros dos caracteres sin censurar)
        $dominioCensurado = substr($dominio, 0, 2).str_repeat('*', $longitudDominio - 2);

        // Formar el correo electrónico censurado
        $correoCensurado = $usuarioCensurado.'@'.$dominioCensurado;

        return $correoCensurado;
    }
}

/**
 * Regresa la entidad del catalogo.
 */
if (! function_exists('get_entidad_del_catalogo')) {
    function get_entidad_del_catalogo($tipo, $indice)
    {
        return [
            'entidad' => [
                5 => [1, 2, 3, 4],
                1 => [5, 6],
                2 => [7, 8],
                4 => [9, 12],
                3 => [10, 11],
                6 => [13, 14],
            ],
        ][$tipo][$indice];
    }
}
