<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class padron_cat_entidades extends Model
{
    protected $conecction = 'oracle';

    protected $table = 'contribuyentes.cat_entidad'; // <-- El nombre personalizado

    protected $primaryKey = 'clave';
}
