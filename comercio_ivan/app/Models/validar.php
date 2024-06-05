<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class validar extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.validar'; // <-- El nombre personalizado

    protected $primaryKey = 'id_validar';
}
