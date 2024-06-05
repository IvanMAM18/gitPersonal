<?php

namespace App\Http\Controllers;

use App\Models\Negocio;

class CodigoQrNegocioController extends Controller
{
    /**
     * Muestra la pagina del codigo QR de el negocio recibido como parametro.
     */
    public function show(Negocio $negocio)
    {
        return view('comercio.negocio_by_qr_view', compact('negocio'));
    }
}
