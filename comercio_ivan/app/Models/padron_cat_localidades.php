<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class padron_cat_localidades extends Model
{
    protected $conecction = 'oracle';

    protected $table = 'contribuyentes.cat_localidad'; // <-- El nombre personalizado

    protected $primaryKey = 'clave_localidad';
}
