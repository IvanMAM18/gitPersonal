<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cat_tipo_negocio extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.cat_tipo_negocio'; // <-- El nombre personalizado

    protected $primaryKey = 'cv_tipo_negocio';
}
