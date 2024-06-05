<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class catalogo_tipo_anuncio extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.catalogo_tipo_anuncio'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
