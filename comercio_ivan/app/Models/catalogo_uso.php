<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class catalogo_uso extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.catalogo_uso'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
