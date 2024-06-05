<?php

namespace Database\Seeders;

use App\Models\CatalogoTramite;
use App\Models\Subtramite;
use Illuminate\Database\Seeder;

class TramitesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CatalogoTramite::query()->truncate();
        $tramites = json_decode('[{"id":5,"nombre":"Uso de Suelo Sare","descripcion":"Uso de Suelo Sare","link":"/","departamento_id":1,"created_at":"2023-01-09T03:19:50.000000Z","updated_at":"2023-01-09T03:19:50.000000Z","deleted_at":null,"pago":false,"resolutivo":false,"en_linea":false,"tipo":"interno","entidad_revisora_id":1},{"id":9,"nombre":"Contrato de recolecci\u00f3n de basura","descripcion":"Contrato de recolecci\u00f3n de basura","link":"/","departamento_id":4,"created_at":"2023-01-09T03:23:13.000000Z","updated_at":"2023-01-09T03:23:13.000000Z","deleted_at":null,"pago":true,"resolutivo":false,"en_linea":false,"tipo":"interno","entidad_revisora_id":4},{"id":10,"nombre":"Medio Ambiente Sare","descripcion":"Medio Ambiente Sare","link":"/","departamento_id":3,"created_at":"2023-01-09T03:24:09.000000Z","updated_at":"2023-01-09T03:24:09.000000Z","deleted_at":null,"pago":false,"resolutivo":false,"en_linea":false,"tipo":"interno","entidad_revisora_id":3},{"id":7,"nombre":"Dictamen de Protecci\u00f3n Civil Sare","descripcion":"Dictamen de Protecci\u00f3n Civil Sare","link":"/","departamento_id":2,"created_at":"2023-01-09T03:21:18.000000Z","updated_at":"2023-01-09T03:25:26.000000Z","deleted_at":null,"pago":false,"resolutivo":false,"en_linea":false,"tipo":"interno","entidad_revisora_id":2},{"id":1,"nombre":"Licencia de funcionamiento","descripcion":"Licencia de funcionamiento","link":"/app/registrar-negocio","departamento_id":-1,"created_at":"2023-01-09T03:15:57.000000Z","updated_at":"2023-01-09T03:25:53.000000Z","deleted_at":null,"pago":false,"resolutivo":true,"en_linea":false,"tipo":"publico","entidad_revisora_id":null},{"id":2,"nombre":"Licencia de funcionamiento Sare","descripcion":"Licencia de funcionamiento Sare","link":"/app/registrar-negocio","departamento_id":-1,"created_at":"2023-01-09T03:16:24.000000Z","updated_at":"2023-01-09T03:25:58.000000Z","deleted_at":null,"pago":false,"resolutivo":true,"en_linea":false,"tipo":"interno","entidad_revisora_id":null},{"id":3,"nombre":"Refrendo Licencia de funcionamiento","descripcion":"Refrendo Licencia de funcionamiento","link":"/app/registrar-negocio","departamento_id":-1,"created_at":"2023-01-09T03:17:09.000000Z","updated_at":"2023-01-09T03:26:11.000000Z","deleted_at":null,"pago":false,"resolutivo":true,"en_linea":false,"tipo":"publico","entidad_revisora_id":null},{"id":4,"nombre":"Refrendo Licencia de funcionamiento Sare","descripcion":"Refrendo Licencia de funcionamiento Sare","link":"/app/registrar-negocio","departamento_id":-1,"created_at":"2023-01-09T03:17:41.000000Z","updated_at":"2023-01-09T03:26:16.000000Z","deleted_at":null,"pago":false,"resolutivo":true,"en_linea":false,"tipo":"interno","entidad_revisora_id":null},{"id":6,"nombre":"Uso de Suelo","descripcion":"Uso de Suelo","link":"/","departamento_id":1,"created_at":"2023-01-09T03:20:27.000000Z","updated_at":"2023-01-09T03:26:37.000000Z","deleted_at":null,"pago":true,"resolutivo":true,"en_linea":false,"tipo":"interno","entidad_revisora_id":1},{"id":8,"nombre":"Dictamen de Protecci\u00f3n Civil","descripcion":"Dictamen de Protecci\u00f3n Civil","link":"/","departamento_id":2,"created_at":"2023-01-09T03:21:52.000000Z","updated_at":"2023-01-09T03:26:58.000000Z","deleted_at":null,"pago":true,"resolutivo":true,"en_linea":false,"tipo":"interno","entidad_revisora_id":2},{"id":11,"nombre":"Dictamen de Medio Ambiente","descripcion":"Dictamen de Medio Ambiente","link":"/","departamento_id":3,"created_at":"2023-01-09T03:24:53.000000Z","updated_at":"2023-01-09T03:27:28.000000Z","deleted_at":null,"pago":true,"resolutivo":true,"en_linea":false,"tipo":"interno","entidad_revisora_id":3}]', true);

        foreach ($tramites as $tramite) {
            CatalogoTramite::create($tramite);
        }

        $subtramites =
        json_decode('[{"id":1,"catalogo_tramite_padre_id":2,"catalogo_tramite_hijo_id":5,"orden":1},{"id":4,"catalogo_tramite_padre_id":1,"catalogo_tramite_hijo_id":6,"orden":1},{"id":7,"catalogo_tramite_padre_id":4,"catalogo_tramite_hijo_id":5,"orden":1},{"id":2,"catalogo_tramite_padre_id":2,"catalogo_tramite_hijo_id":7,"orden":2},{"id":3,"catalogo_tramite_padre_id":2,"catalogo_tramite_hijo_id":10,"orden":2},{"id":5,"catalogo_tramite_padre_id":1,"catalogo_tramite_hijo_id":7,"orden":2},{"id":6,"catalogo_tramite_padre_id":1,"catalogo_tramite_hijo_id":11,"orden":2},{"id":8,"catalogo_tramite_padre_id":4,"catalogo_tramite_hijo_id":7,"orden":2},{"id":9,"catalogo_tramite_padre_id":4,"catalogo_tramite_hijo_id":10,"orden":2},{"id":11,"catalogo_tramite_padre_id":3,"catalogo_tramite_hijo_id":8,"orden":2},{"id":12,"catalogo_tramite_padre_id":3,"catalogo_tramite_hijo_id":11,"orden":2},{"id":10,"catalogo_tramite_padre_id":3,"catalogo_tramite_hijo_id":5,"orden":1},{"id":13,"catalogo_tramite_padre_id":1,"catalogo_tramite_hijo_id":9,"orden":2},{"id":14,"catalogo_tramite_padre_id":2,"catalogo_tramite_hijo_id":9,"orden":2},{"id":15,"catalogo_tramite_padre_id":3,"catalogo_tramite_hijo_id":9,"orden":2},{"id":16,"catalogo_tramite_padre_id":4,"catalogo_tramite_hijo_id":9,"orden":2}]', true);

        Subtramite::query()->truncate();
        foreach ($subtramites as $subtramite) {
            Subtramite::create($subtramite);
        }
    }
}
