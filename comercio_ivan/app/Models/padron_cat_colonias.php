<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class padron_cat_colonias extends Model
{
    protected $conecction = 'oracle';

    protected $table = 'contribuyentes.cat_colonia'; // <-- El nombre personalizado
}
