<?php

namespace App\Http\Controllers;

use App\Models\CatalogoServicioPrivadoRecoleccionBasura;
use Illuminate\Http\Request;

class CatalogoServicioPrivadoRecoleccionBasuraController extends Controller
{
    public function index(Request $request)
    {
        if ($request->tramite_pasado) {
            $catalogoItems = CatalogoServicioPrivadoRecoleccionBasura::onlyTrashed()->get();
        } else {
            $catalogoItems = CatalogoServicioPrivadoRecoleccionBasura::all();
        }
        $formattedItems = $catalogoItems->map(function ($item) {
            return [
                'value' => $item->nombre,
                'title' => $item->nombre,
            ];
        });

        return $formattedItems;
    }
}
