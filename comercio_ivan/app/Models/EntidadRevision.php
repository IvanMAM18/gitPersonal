<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EntidadRevision extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'entidad_revision';

    protected $fillable = [
        'nombre',
        'departamento_id',
    ];

    public function condicionantes()
    {
        return $this->belongsToMany(Condicionantes::class, 'condicionante_entidad', 'entidad_revisora_id', 'condicionante_id');
    }
}
