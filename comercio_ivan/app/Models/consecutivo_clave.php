<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class consecutivo_clave extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.consecutivo_clave'; // <-- El nombre personalizado

    protected $primaryKey = 'id_folio';
}
