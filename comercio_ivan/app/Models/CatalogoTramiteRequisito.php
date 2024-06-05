<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoTramiteRequisito extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'catalogo_tramites_requisitos';

    protected $fillable = [
        'catalogo_tramites_id',
        'requisito_id',
    ];
}
