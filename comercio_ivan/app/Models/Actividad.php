<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    use HasFactory;

    /*
     * Nombre de la tabla en la base de datos
     */
    protected $table = 'actividades';

    /**
     * Attributos que se puede guardar en masa.
     */
    protected $fillable = [
        'descripcion'
    ];

    /**
     * Actividades Registradas.
     */
    public static $REVISION_APROVADA = 'Revision Aprobada.';
    public static $CONDICIONANTE_AGREGADA_A_TRAMITE_CATALOGO = 'Condicionante agregada a tramite catalogo.';
    public static $REQUISITO_AGREGADA_A_TRAMITE_CATALOGO = 'Requisito agregado a tramite catalogo.';

    /**
     * El usuario que realizo la actividad.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
