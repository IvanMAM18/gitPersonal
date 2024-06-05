<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cat_Bajo_Impacto2020 extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.cat_bajo_impacto2020'; // <-- El nombre personalizado

    protected $primaryKey = 'id_giro';
}
