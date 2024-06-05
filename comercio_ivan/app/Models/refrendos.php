<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class refrendos extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.refrendos'; // <-- El nombre personalizado

    protected $primaryKey = 'folio';
}
