<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GiroComercial extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'giro_comercial';

    protected $fillable = [
        'nombre',
        'clave_scian',
        'descripcion',
        'catalogo_giro_comercial_id',
        'tipo',
        'servicio_publico_id',
        'tipo_sector',
    ];

    public function servicios_publicos()
    {
        return $this->hasOne(CatalogoGirosComercialesRecoleccionBasura::class, 'id', 'servicio_publico_id');
    }
}
