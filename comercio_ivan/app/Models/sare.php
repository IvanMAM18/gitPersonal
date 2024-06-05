<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class sare extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.solicitudes'; // <-- El nombre personalizado

    protected $primaryKey = 'folio';
}
