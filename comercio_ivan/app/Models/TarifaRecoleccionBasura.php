<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TarifaRecoleccionBasura extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tarifa_recoleccion_basura';

    protected $fillable = [
        'giro_comercial_id',
        'periodo',
        'volumen',
        'valor_uma',
        'descripcion',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function catalogo_giro_comercial()
    {
        return $this->belongsTo(CatalogoGirosComercialesRecoleccionBasura::class, 'giro_comercial_id');
    }
}
