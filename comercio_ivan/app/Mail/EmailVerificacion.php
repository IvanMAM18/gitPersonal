<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailVerificacion extends Mailable
{
    use Queueable;
    use SerializesModels;

    public $nombre;

    public $token;

    public function __construct($nombre, $token, $ruta)
    {
        $this->nombre = $nombre;
        $this->token = $token;
        $this->ruta = $ruta;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.verificacion')
            ->with([
                'nombre' => $this->nombre,
                'token' => $this->token,
                'ruta' => $this->ruta,
            ]);
    }
}
