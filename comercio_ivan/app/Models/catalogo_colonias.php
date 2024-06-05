<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class catalogo_colonias extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.catalogo_colonias'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
