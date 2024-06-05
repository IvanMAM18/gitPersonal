<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NegocioRequisitoRevision extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'negocio_requisito_revision';

    protected $fillable = [
        'requisito_id',
        'revision_id',
        'catalogo_id',
        'estado_revision_id',
        'status',
        'revision_id',
    ];

    // public function archivo ()
    // {
    //     return $this->belongsTo('App\Models\NegocioRequisito', 'id', 'requisito_id');
    // }

    public function requisito()
    {
        return $this->belongsTo('App\Models\Requisito');
    }

    public function revision()
    {
        return $this->belongsTo('App\Models\Revision');
    }

    public function negocio_requisito_archivo()
    {
        return $this->hasOne('App\Models\NegocioRequisito', 'requisito_id', 'requisito_id');
    }
}
