<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cat_camaras extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.cat_camaras'; // <-- El nombre personalizado

    protected $primaryKey = 'id_cat_camara';
}
