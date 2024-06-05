<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Roles extends Model
{
    use HasFactory;
    use SoftDeletes;

    public static $SUPER_ADMIN = 'Superadmin';

    public static $ENTIDAD_REVISORA = 'EntidadRevisora';

    public static $PERSONA = 'Persona';

    public static $COMERCIO_ADMIN = 'comercio_admin';

    public static $DIRECTOR_ENTIDAD_REVISORA = 'EntidadRevisoraDirector';

    public static $DIRECTOR_DE_COMERCIO = 'ComercioDirector';

    public static $ADMINISTRADOR_DE_COMERCIO_VISOR = 'ComercioAdminVisor';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];
}
