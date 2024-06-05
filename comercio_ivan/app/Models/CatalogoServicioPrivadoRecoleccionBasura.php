<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoServicioPrivadoRecoleccionBasura extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'tramite_id',
        'nombre',
    ];

    public function tramite()
    {
        return $this->hasOne(Tramite::class, 'tramite_id', 'id');
    }
}
