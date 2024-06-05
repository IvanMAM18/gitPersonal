<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Direccion extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'direcciones';

    protected $fillable = [
        'calle_principal',
        'calles',
        'numero_externo',
        'numero_interno',
        'colonia_id',
        'codigo_postal',
        'latitud',
        'longitude',
        'tipo',
        'delegacion',
    ];

    public function colonia()
    {
        //return $this->belongsTo('App\Writer', 'nombre_clave_foranea', 'nombre_clave_otra_tabla');
        return $this->belongsTo('App\Models\CodigoPostal', 'colonia_id', 'id');
    }

    public function negocio()
    {
        return $this->belongsTo('App\Models\Direccion');
    }
}
