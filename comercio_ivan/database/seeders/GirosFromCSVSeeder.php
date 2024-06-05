<?php

namespace Database\Seeders;

use App\Models\CatalogoGirosComercialesRecoleccionBasura;
use App\Models\GiroComercial;
use Illuminate\Database\Seeder;

class GirosFromCSVSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        GiroComercial::query()->truncate();

        $giros = [];

        if (($open = fopen(resource_path('/data/giros.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $giros[] = $data;
            }

            fclose($open);
        }

        for ($i = 1; $i < count($giros); $i++) {
            $servicio_publico_string = $giros[$i][3];
            $servicio_publico_string = str_replace(["\r", "\n"], '', $servicio_publico_string);
            $servicio_publico_string = str_replace(['  '], ' ', $servicio_publico_string);
            $servicio_publico = CatalogoGirosComercialesRecoleccionBasura::where('nombre', $servicio_publico_string)->first();
            GiroComercial::create([
                'clave_scian' => $giros[$i][0],
                'nombre' => $giros[$i][1],
                'descripcion' => $giros[$i][2],
                'servicio_publico_id' => $servicio_publico === null ? -1 : $servicio_publico->id,
                'tipo' => $this::getGiroTipo($giros[$i][4]),
                'catalogo_giro_comercial_id' => 1,
            ]);
        }

        return GiroComercial::all();
    }

    public static function getGiroTipo($tipo_from_csv)
    {
        switch ($tipo_from_csv) {
            case 'Mediano/Alto':
                return 'mediano_alto_impacto';
            case 'Bajo':
                return 'bajo_impacto';
            default:
                return 'bajo_impacto';
        }
    }
}
