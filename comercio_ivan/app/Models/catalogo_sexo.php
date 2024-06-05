<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class catalogo_sexo extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.catalogo_sexo'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
