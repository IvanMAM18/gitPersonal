<?php

namespace App\Http\Controllers;

use App\Models\CatalogoGirosComercialesRecoleccionBasura;
use App\Models\TarifaRecoleccionBasura;
use Illuminate\Http\Request;

class RecoleccionBasuraController extends Controller
{
    public function getGirosComerciales()
    {
        return CatalogoGirosComercialesRecoleccionBasura::all();
    }

    public function getTarifasByGiroComercial(Request $request)
    {
        return TarifaRecoleccionBasura::whereIn('giro_comercial_id', $request['servicios_ids'])
            ->where('periodo', $request['periodo'])
            ->where('volumen', $request['volumen'])
            ->orderby('valor_uma', 'desc')
            ->get();
    }

    public function getTarifasByGiroComercialById($tarifa_id)
    {
        return TarifaRecoleccionBasura::find($tarifa_id);
    }
}
