<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class bitacora_borra_solicitud extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.bitacora_borra_solicitud'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
