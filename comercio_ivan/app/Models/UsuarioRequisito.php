<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UsuarioRequisito extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'usuario_requisitos';

    protected $fillable = [
        'user_id',
        'requisito_id',
        'tipo_usuario',
        'archivo_path',
    ];

    public function requisito()
    {
        return $this->belongsTo(Requisito::class);
    }
}
