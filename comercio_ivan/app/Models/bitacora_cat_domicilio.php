<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class bitacora_cat_domicilio extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.bitacora_cat_domicilio'; // <-- El nombre personalizado

    protected $primaryKey = 'id_domicilio';
}
