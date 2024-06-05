<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class bitacora_solicitudesr extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.bitacora_solicitudesr'; // <-- El nombre personalizado

    protected $primaryKey = 'folio';
}
