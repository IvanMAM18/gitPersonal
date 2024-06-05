<?php

namespace App\Services;

use App\Models\AvisoEntero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\UnauthorizedException;

class CatastroGateway
{
    // Credenciales username y password para authenticatse.
    protected $credentials = [];

    // El cliente HTTP para realizar las llamadas a la API.
    protected $client;

    // El "request" solicitud actual.
    protected $request;

    /**
     * Constructor
     */
    public function __construct($config, Request $request)
    {
        $this->request = $request;
        $this->setCredentials($config);
        $this->client = Http::baseUrl('https://catastro.lapaz.gob.mx/catastro');
    }

    /**
     * Valida un RFC en la api, tambien si no estamos en produccion
     * se aceptan los valores test-rfc-ok y test-rfc-fail para pruebas
     */
    public function validarRfc($rfc)
    {
        if (! isProduction()) {
            if (strtolower($rfc) === 'test-rfc-ok') {
                return [
                    'estado' => 'ok',
                    'cancelado' => false,
                    'localizado' => true,
                    'msg' => strtoupper('test-rfc-ok'),
                ];
            }
            // se agrego esto por que el js en personas morales actualmente tiene un regex pattern para validarlo despues que se actualice esa pagina lo quitamos
            if (strtolower($rfc) === 'tmg180808ip3') {
                return [
                    'estado' => 'ok',
                    'cancelado' => false,
                    'localizado' => true,
                    'msg' => strtoupper('tmg180808ip5'),
                ];
            }
            if (strtolower($rfc) === 'test-rfc-fail') {
                return [
                    'estado' => 'ok',
                    'cancelado' => false,
                    'localizado' => false,
                    'msg' => strtoupper('test-rfc-fail'),
                ];
            }
        }

        $response = $this->getToken();

        return $this->client->withHeaders([
            'Authorization' => 'Bearer '.$response['token'],
        ])
            ->get('/factura/validarRfc?rfc='.strtoupper($rfc))
            ->json();
    }

    /**
     * Faltan Comentarios porque nose para que funcione esta llamdda de API
     */
    public function getInfo($data)
    {
        $response = $this->getToken();

        return $this->client->withHeaders([
            'Authorization' => 'Bearer '.$response['token'],
        ])
            ->post('/otrosGn', [
                'query' => $data['clave_folio'],
                'tipo' => $data['tipo_predial'],
                'hasta' => '',
            ])
            ->json();
    }

    public function obtenerDetallesAvisoEntero(AvisoEntero $aviso)
    {
        $cacheKey = 'obtenerDetallesAvisoEntero?no_aviso='.$aviso->no_aviso;
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $response = $this->getToken();

        $respuesta = $this->client->withHeaders([
            'Authorization' => 'Bearer '.$response['token'],
        ])
            ->post('/avisos/maestro', [
                'servicio' => 'Q',
                'no_aviso' => $aviso->no_aviso,
            ]);

        Cache::put($cacheKey, $respuesta->json(), now()->hours(12));

        return $respuesta;
    }

    /**
     * Verifica si el predial a sido paragado para la clave y tipo de predial recividos en el request.
     */
    public function validatePredialPagado($data)
    {
        if (! isProduction()) {
            if (strtolower($data['clave_folio']) == 'test') {
                return json_encode(false);
            }
        }

        $response = $this->getToken();

        return $this->client->withHeaders([
            'Authorization' => 'Bearer '.$response['token'],
        ])
            ->post('/adeudoGn', [
                'query' => $data['clave_folio'],
                'tipo' => $data['tipo_predial'],
                'hasta' => '',
            ]);
    }

    /**
     * Obtiene el token de authenticacion para hacer llamadas a la API.
     */
    public function getToken()
    {
        $data = $this->client->post('/authenticate', $this->getCredentials())
            ->json();

        if (in_array('token', $data) || $data['token'] == null) {
            throw new UnauthorizedException('Could not get access token from catastro');
        }

        return $data;
    }

    /**
     * Regresa las credenciales despues obtener un token para hacer consultas a la API.
     */
    private function getCredentials(): array
    {
        return $this->credentials;
    }

    /**
     * Settea las credenciales desde los archivos de configuracion de laravel.
     */
    private function setCredentials($config): void
    {
        $this->credentials = $config;
    }
}
