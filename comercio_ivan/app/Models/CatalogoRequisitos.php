<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoRequisitos extends Model
{
    use SoftDeletes;

    protected $connection = 'pgsql';

    protected $table = 'public.catalogo_requisitos'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
