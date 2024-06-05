<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cat_domicilio extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.cat_domicilio'; // <-- El nombre personalizado

    protected $primaryKey = 'id_domicilio';
}
