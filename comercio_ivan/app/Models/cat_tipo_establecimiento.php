<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cat_tipo_establecimiento extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.cat_tipo_establecimiento'; // <-- El nombre personalizado

    protected $primaryKey = 'id_tipo_establecimiento';
}
