<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NegocioRequisito extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'negocio_requisitos';

    protected $fillable = [
        'negocio_id',
        'requisito_id',
        'archivo_path',
        'tramite_id',
    ];

    public function negocio()
    {
        return $this->belongsTo('App\Models\Negocio');
    }

    public function negocio_requisito_revision()
    {
        /**
         * OBSOLETO
         */
        return $this->belongsTo('App\Models\NegocioRequisitoRevision', 'requisito_id');
    }
}
