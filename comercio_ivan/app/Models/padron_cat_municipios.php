<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class padron_cat_municipios extends Model
{
    protected $conecction = 'oracle';

    protected $table = 'contribuyentes.cat_inegi_municipios';

    protected $primaryKey = 'clave';
}
