<?php

namespace App\Models;

use App\Mail\EmailVerificacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Mail;

class TemporalUser extends Model
{
    protected $fillable = [
        'nombre',
        'apellido_pat',
        'apellido_mot',
        'rfc',
        'curp',
        'telefono',
        'email',
        'email_verified_at',
        'direccion_de_notificacion_id',
        'role_id',
        'entidad_revision_id',
        'password',
        'regimen_fiscal',
    ];

    use HasFactory;
    use SoftDeletes;

    public function enviarEmailVerificacionNotification($token, $ruta)
    {
        Mail::to($this->email)->send(new EmailVerificacion($this->nombre, $token, $ruta));
    }
}
