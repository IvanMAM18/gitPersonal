<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AvisoEntero extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    public static $VIGENTE = 'VIGENTE';

    public static $PAGADO = 'PAGADO';

    public static $EXPIRADO = 'EXPIRADO';

    protected $table = 'avisos_entero';

    protected $casts = [
        'vigente' => 'boolean',
    ];

    protected $appends = [
        'vigente',
        'pagado',
        'expirado',
        'hora',
        'fecha',
    ];

    public function tramite()
    {
        return $this->belongsTo(Tramite::class);
    }

    public function getVigenteAttribute()
    {
        return $this->estado == self::$VIGENTE;
    }

    public function getPagadoAttribute()
    {
        return $this->estado == self::$PAGADO;
    }

    public function getExpiradoAttribute()
    {
        return $this->estado == self::$EXPIRADO;
    }

    public function getHoraAttribute()
    {
        return $this == null || $this->created_at == null
            ? null
            : $this->created_at->timezone('America/Mazatlan')->format('H:i');
    }

    public function getFechaAttribute()
    {
        return $this == null || $this->created_at == null
            ? null
            : $this->created_at->timezone('America/Mazatlan')->format('d-m-Y');
    }
}
