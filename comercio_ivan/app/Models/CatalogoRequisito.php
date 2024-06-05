<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoRequisito extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'entidad_id',
        'requisito_id',
    ];

    /*public function requisito () {
        return $this->hasMany('App\Models\Requisito');
    }*/
}
