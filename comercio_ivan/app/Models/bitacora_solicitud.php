<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class bitacora_solicitud extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.bitacora_solicitudes'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
