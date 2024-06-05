<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonaRequisito extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'personas_requisitos';

    protected $fillable = [
        'persona_type',
        'persona_id',
        'requisito_id',
        'valor',
    ];

    public function persona()
    {
        return $this->morphTo();
    }
}
