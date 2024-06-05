<?php

namespace App\Helpers;

class TurismoAPI
{
    public static $CLAVES_SCIAN = [112910, 113211, 312149, 313112, 313113, 313210, 313220, 313240, 314991, 314992, 314993, 315192, 315210, 316110, 316211, 316219, 316991, 316999, 321111, 321991, 321992, 322110, 327111, 327219, 327991, 327999, 331412, 331510, 331520, 332320, 335120, 339930, 488310, 519121, 519122, 711212, 112512, 339912, 339994, 466313, 813110, 339913, 518210, 114210, 512130, 561920, 711111, 711112, 711191, 711192, 712111, 712112, 712120, 712131, 712132, 712190, 713111, 713112, 713113, 713114, 713910, 713930, 713941, 713942, 713950, 713991, 713998, 713999, 561510, 561520, 561590, 487110, 487210, 487990, 312120, 312131, 312132, 312139, 312141, 312142, 722514, 722515, 722330, 722512, 722516, 722517, 722412, 722411, 722513, 722519, 722511, 721111, 721112, 721113, 721120, 721190, 721210, 721311, 721312];

    public static function formatearHorarios($horarios)
    {
        $horarios = json_decode($horarios);
        if (is_array($horarios)) {
            return [
                'lunes' => 'NO DISPONIBLE',
                'martes' => 'NO DISPONIBLE',
                'miercoles' => 'NO DISPONIBLE',
                'jueves' => 'NO DISPONIBLE',
                'viernes' => 'NO DISPONIBLE',
                'sabado' => 'NO DISPONIBLE',
                'domingo' => 'NO DISPONIBLE',
            ];
        }
        $lunes = property_exists($horarios, 'lunes') && property_exists($horarios, 'lunesc')
            ? "{$horarios->lunes} - {$horarios->lunesc}"
            : 'CERRADO';
        $martes = property_exists($horarios, 'martes') && property_exists($horarios, 'martesc')
            ? "{$horarios->martes} - {$horarios->martesc}"
            : 'CERRADO';
        $miercoles = property_exists($horarios, 'miercoles') && property_exists($horarios, 'miercolesc')
            ? "{$horarios->miercoles} - {$horarios->miercolesc}"
            : 'CERRADO';
        $jueves = property_exists($horarios, 'jueves') && property_exists($horarios, 'juevesc')
            ? "{$horarios->jueves} - {$horarios->juevesc}"
            : 'CERRADO';
        $viernes = property_exists($horarios, 'viernes') && property_exists($horarios, 'viernesc')
            ? "{$horarios->viernes} - {$horarios->viernesc}"
            : 'CERRADO';
        $sabado = property_exists($horarios, 'sabado') && property_exists($horarios, 'sabadoc')
            ? "{$horarios->sabado} - {$horarios->sabadoc}"
            : 'CERRADO';
        $domingo = property_exists($horarios, 'domingo') && property_exists($horarios, 'domingoc')
            ? "{$horarios->domingo} - {$horarios->domingoc}"
            : 'CERRADO';

        return [
            'lunes' => $lunes,
            'martes' => $martes,
            'miercoles' => $miercoles,
            'jueves' => $jueves,
            'viernes' => $viernes,
            'sabado' => $sabado,
            'domingo' => $domingo,
        ];
    }
}
