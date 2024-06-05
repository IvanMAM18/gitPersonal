<?php

namespace Tests\APIs;

use App\Services\CatastroGateway;
use Tests\TestCase;

/**
 * @group apis
 */
class CatastroGatewayTest extends TestCase
{
    protected $gateway;

    public function setUp(): void
    {
        parent::setUp();
        $this->gateway = app()->make(CatastroGateway::class);
    }

    public function test_la_api_para_obtener_un_token_de_authenticacion()
    {
        $response = $this->gateway->getToken();
        $this->assertArrayHasKey('token', $response);
    }

    public function test_validar_api_de_predial_pagado()
    {
        $response = $this->gateway->validatePredialPagado([
            'clave_folio' => '',
            'tipo_predial' => '',
        ]);
        $this->assertCount(5, $response);
        $this->assertArrayHasKey('timestamp', $response);
        $this->assertArrayHasKey('status', $response);
        $this->assertArrayHasKey('error', $response);
        $this->assertArrayHasKey('message', $response);
        $this->assertArrayHasKey('path', $response);
    }

    public function test_validar_api_de_informacion()
    {
        $response = $this->gateway->getInfo([
            'clave_folio' => '',
            'tipo_predial' => '',
        ]);
        $this->assertCount(5, $response);
        $this->assertArrayHasKey('timestamp', $response);
        $this->assertArrayHasKey('status', $response);
        $this->assertArrayHasKey('error', $response);
        $this->assertArrayHasKey('message', $response);
        $this->assertArrayHasKey('path', $response);
    }

    public function test_la_api_para_validar_la_respuesta_de_un_rfc_valido()
    {
        $rfc = 'test-rfc-ok';
        $response = $this->gateway->validarRfc($rfc);
        $this->assertEquals($response, [
            'estado' => 'ok',
            'cancelado' => false,
            'localizado' => true,
            'msg' => strtoupper($rfc),
        ]);
    }

    public function test_la_api_para_validar_la_respuesta_de_un_rfc_no_vavalido()
    {
        $rfc = 'test-rfc-fail';
        $response = $this->gateway->validarRfc($rfc);
        $this->assertEquals($response, [
            'estado' => 'ok',
            'cancelado' => false,
            'localizado' => false,
            'msg' => strtoupper('test-rfc-fail'),
        ]);
    }
}
