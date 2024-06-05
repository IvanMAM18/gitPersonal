<?php

namespace App\Helpers;

use App\Models\AvisoEntero;
use Http;
use Illuminate\Support\Facades\Cache;

class AvisosEnteroAPI
{
    public static function obtenerTokenAPI()
    {
        $cacheKey = 'obtenerTokenAPI';
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $respuesta = Http::post('https://catastro.lapaz.gob.mx/catastro/authenticate', [
            'username' => 'api-comercio',
            'password' => 'api-comercio',
        ]);

        if ($respuesta->status() != 200) {
            return;
        }

        $token = $respuesta->json()['token'];
        Cache::put($cacheKey, $token, $seconds = 600);

        return $token;
    }

    public static function obtenerDetallesAvisoEntero(AvisoEntero $avisoEntero)
    {
        $numAviso = $avisoEntero->no_aviso;

        $cacheKey = 'obtenerDetallesAvisoEntero?no_aviso='.$numAviso;
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $token = self::obtenerTokenAPI();

        $respuesta = Http::withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->post('https://catastro.lapaz.gob.mx/catastro/avisos/maestro', [
            'servicio' => 'Q',
            'no_aviso' => $numAviso,
        ]);

        Cache::put($cacheKey, $respuesta->json(), $seconds = 1200);

        return $respuesta;
    }
}
