<?php

namespace App\Models;

use Maatwebsite\Excel\Concerns\ToModel;

class NegocioImport implements ToModel
{
    /**
     * @return Negocio|null
     */
    public function model(array $row)
    {
        return new Negocio([
            'nombre_del_negocio' => $row[12],
        ]);
    }
}
