<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class solicitudesr extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.solicitudesr'; // <-- El nombre personalizado

    protected $primaryKey = 'folio';
}
