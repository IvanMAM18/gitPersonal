<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CondicionantesRevision extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'condicionantes_revisions';

    protected $fillable = [
        'revision_id',
        'condicionante_id',
        'estado_id',
    ];

    public function condicionante()
    {
        return $this->belongsTo('App\Models\Condicionantes');
    }

    // public function condicionante()
    // {
    //     return $this->belongsTo(CondicionantesRevision::class, 'condicionante_id');
    // }

    // public function revision() {
    //     return $this->belongsTo('App\Models\Revision', 'revision_id');
    // }

}
