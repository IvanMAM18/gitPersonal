<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cat_giros extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.cat_giros'; // <-- El nombre personalizado

    protected $primaryKey = 'id_giro';
}
