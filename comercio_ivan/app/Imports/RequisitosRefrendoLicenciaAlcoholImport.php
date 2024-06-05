<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class RequisitosRefrendoLicenciaAlcoholImport implements ToCollection
{
    /**
     * @param  Collection  $collection
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $requisitos = new \StdClass();
            $requisitos->numero_licencia = $row[0];
            $requisitos->nombre_operador = $row[1];
            $requisitos->direccion_operador = $row[1];
        }
    }
}
