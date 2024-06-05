<?php

namespace App\Http\Controllers;

ini_set('max_execution_time', 30000);
use App\Models\CodigoPostal;
use App\Models\CondicionanteEntidad;
use App\Models\Condicionantes;
use App\Models\DenueCSV;
use App\Models\GiroComercial;
use App\Models\SareCSV;
use App\Models\SareDenueJoin;
use Illuminate\Support\Facades\DB;

class SareCSVController extends Controller
{
    public function saveCSVInfo()
    {
        $negocios = [];

        if (($open = fopen(resource_path().'/data/sare.csv', 'r')) !== false) {
            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $negocios[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($negocios); $i++) {
            SareCSV::create([
                'CLAVEMUN' => $negocios[$i][0],
                'FOLIO' => $negocios[$i][1],
                'CUENTAS' => $negocios[$i][2],
                'CURP' => $negocios[$i][3],
                'RFC' => $negocios[$i][4],
                'NOMBRE' => $negocios[$i][5],
                'APELLIDO1' => $negocios[$i][6],
                'APELLIDO2' => $negocios[$i][7],
                'ESTABLECIMIENTO' => $negocios[$i][8],
                'DIRECCION' => $negocios[$i][9],
                'ENTRE' => $negocios[$i][10],
                'YENTRE' => $negocios[$i][11],
            ]);
        }

        return SareCSV::all();
    }

    public function saveCSVGiros()
    {
        $giros = [];

        if (($open = fopen(resource_path('/data/giros.csv'), 'r')) !== false) {
            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $giros[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($giros); $i++) {
            GiroComercial::create([
                'clave_scian' => $giros[$i][0],
                'nombre' => $giros[$i][1],
                'descripcion' => $giros[$i][2],
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

    public function saveDenueCSVInfo()
    {
        $negocios = [];

        if (($open = fopen(resource_path('/data/denue.csv'), 'r')) !== false) {
            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $negocios[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < (count($negocios) - 1); $i++) {
            DenueCSV::create([
                'ENCONTRADOS' => $negocios[$i][3],
                'SARE_FOLIO' => $negocios[$i][4],
                'LICENCIA_2022' => $negocios[$i][5],
                'ESTABLECIMIENTO' => $negocios[$i][2],
                'DIRECCION' => $negocios[$i][11].' '.$negocios[$i][29],
                'ENTRE' => $negocios[$i][13],
                'YENTRE' => $negocios[$i][15],
                'LATITUDE' => $negocios[$i][42],
                'LONGITUDE' => $negocios[$i][43],
            ]);
        }

        return DenueCSV::all();
    }

    public function SareJoin()
    {
        /*User::select('users.nameUser', 'categories.nameCategory')
                ->join('categories', 'users.idUser', '=', 'categories.user_id')
                ->get();*/
        $sare_join = SareCSV::select(
            'sare_csv.FOLIO',
            'sare_csv.ESTABLECIMIENTO',
            'sare_csv.NOMBRE',
            'sare_csv.APELLIDO1',
            'sare_csv.APELLIDO2',
            'sare_csv.DIRECCION',
            'sare_csv.ENTRE',
            'sare_csv.YENTRE',
            'denue_csv.ENCONTRADOS',
            'denue_csv.SARE_FOLIO',
            'denue_csv.LICENCIA_2022',
            'denue_csv.LATITUDE',
            'denue_csv.LONGITUDE'
        )
            ->leftJoin('denue_csv', 'sare_csv.FOLIO', '=', 'denue_csv.SARE_FOLIO')//sare_csv.folio = denue_csv.sare_folio
            ->get();

        return response()->json($sare_join);
    }

    public function SareDenueJoinSave()
    {

        $sare_join = SareCSV::select(
            'sare_csv.FOLIO',
            'sare_csv.ESTABLECIMIENTO',
            'sare_csv.NOMBRE',
            'sare_csv.APELLIDO1',
            'sare_csv.APELLIDO2',
            'sare_csv.DIRECCION',
            'sare_csv.ENTRE',
            'sare_csv.YENTRE',
            'denue_csv.ENCONTRADOS',
            'denue_csv.SARE_FOLIO',
            'denue_csv.LICENCIA_2022',
            'denue_csv.LATITUDE',
            'denue_csv.LONGITUDE'
        )
            ->leftJoin('denue_csv', 'sare_csv.FOLIO', '=', 'denue_csv.SARE_FOLIO')
            ->get();

        for ($i = 0; $i < count($sare_join); $i++) {
            SareDenueJoin::create([
                'FOLIO' => $sare_join[$i]['FOLIO'],
                'ESTABLECIMIENTO' => $sare_join[$i]['ESTABLECIMIENTO'],
                'NOMBRE' => $sare_join[$i]['NOMBRE'],
                'APELLIDO1' => $sare_join[$i]['APELLIDO1'],
                'APELLIDO2' => $sare_join[$i]['APELLIDO2'],
                'DIRECCION' => $sare_join[$i]['DIRECCION'],
                'ENTRE' => $sare_join[$i]['ENTRE'],
                'YENTRE' => $sare_join[$i]['YENTRE'],
                'ENCONTRADOS' => $sare_join[$i]['ENCONTRADOS'],
                'SARE_FOLIO' => $sare_join[$i]['SARE_FOLIO'],
                'LICENCIA_2022' => $sare_join[$i]['LICENCIA_2022'],
                'LATITUDE' => $sare_join[$i]['LATITUDE'],
                'LONGITUDE' => $sare_join[$i]['LONGITUDE'],
            ]);
        }

        return SareDenueJoin::all();
    }

    public function SareDenueJoinGetTableData()
    {
        $sare_denue_join = SareDenueJoin::all();

        return response()->json($sare_denue_join);
    }

    public function saveCSVCodigosPostales()
    {

        return CodigoPostal::all();
    }

    public function condicionantes()
    {
        DB::table('condicionante_entidad')->truncate();
        DB::table('condicionantes')->truncate();

        $condicionantes = [];

        if (($open = fopen(resource_path('/data/condicionantes_medio_ambiente.csv'), 'r')) !== false) {
            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $condicionantes[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($condicionantes); $i++) {
            //id: 3,
            // nombre: "Ecologia",
            $c = Condicionantes::create([
                'nombre' => $condicionantes[$i][0],
                'descripcion' => $condicionantes[$i][0],
            ]);
            CondicionanteEntidad::create([
                'entidad_revisora_id' => 3,
                'condicionante_id' => $c->id,
            ]);
        }

        $condicionantes = [];

        if (($open = fopen(resource_path('/data/condicionantes_proteccion_civil.csv'), 'r')) !== false) {
            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $condicionantes[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($condicionantes); $i++) {
            // id: 2,
            // nombre: "Protección civil",
            $c = Condicionantes::create([
                'nombre' => $condicionantes[$i][0],
                'descripcion' => $condicionantes[$i][0],
            ]);
            CondicionanteEntidad::create([
                'entidad_revisora_id' => 2,
                'condicionante_id' => $c->id,
            ]);
        }
    }
}
