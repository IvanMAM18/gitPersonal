<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequisitoRevision extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'requisito_revision';

    protected $fillable = [
        'requisito_id',
        'revision_id',
        'status',
        'estado_revision_id',
        'valor',
    ];

    public function requisito()
    {
        return $this->belongsTo('App\Models\Requisito');
    }

    public function scopeEnRevision($query)
    {
        return $query->whereIn('status', ['EN REVISION', 'ENVIADO', 'PENDIENTE']);
    }
}
