<?php

namespace App\Helpers;

class Refrendos
{
    public static $LICENCIA_DE_FUNCIONAMIENTO = 3;

    public static $LICENCIA_DE_FUNCIONAMIENTO_SARE = 4;

    /**
     * Regresa un array con todos los id de los refrendos.
     */
    public static function licenciasDeFuncionamiento(): array
    {
        return [
            self::$LICENCIA_DE_FUNCIONAMIENTO,
            self::$LICENCIA_DE_FUNCIONAMIENTO_SARE,
        ];
    }
}
