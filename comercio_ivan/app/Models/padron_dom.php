<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class padron_dom extends Model
{
    protected $conecction = 'oracle';

    protected $table = 'contribuyentes.padronuc_dom'; // <-- El nombre personalizado

    protected $primaryKey = 'id_domicilio';

    protected $dateFormat = 'd-m-Y';
}
