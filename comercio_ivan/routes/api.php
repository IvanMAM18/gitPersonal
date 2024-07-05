<?php

use App\Http\Controllers\ExternalServiceController;
use App\Http\Controllers\NegocioController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\AvisoEnteroMultasController;
use App\Http\Controllers\TrabajadorFotoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// External Services Auth
Route::post('/auth/register', [ExternalServiceController::class, 'register']);
Route::post('/auth/register/verified', [ExternalServiceController::class, 'registerVerified']);
Route::post('/auth/login', [ExternalServiceController::class, 'login']);

Route::get('/siged/trabajador/foto-post', [TrabajadorFotoController::class, 'index'])->name('trabajador-foto.index');
Route::middleware('auth:api')->post('/negocios/{negocio}/aviso-de-entero', [AvisoEnteroMultasController::class, 'index']);
Route::middleware('signed')->post('/trabajador/foto', [TrabajadorFotoController::class, 'store'])->name('trabajador-foto.store');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Route::post('graba_usuario','App\Http\Controllers\PersonaController@graba_persona');
Route::post('agregar', [PersonaController::class, 'store']);
Route::post('editar', [PersonaController::class, 'update']);
Route::delete('borrar/{id}', [PersonaController::class, 'destroy']);

Route::prefix('turismo')->group(function () {
    Route::get('/negocios', [NegocioController::class, 'apiTurismo']);
});


// comercio publico:

Route::get('/get_tarifa_recoleccion_basura_info_by_id/{tarifa_recoleccion_id}', [Controllers\AdminCrudController::class, 'getRecoleccionBasuraInfoByTarifaId']);
Route::post('/get-negocio-por-filtro-id/{negocio_id}', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosIdApi']);
Route::post('/get-all-negocios-por-filtro', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosAPI']);
Route::get('/get_giros_comerciales_registro', [Controllers\GirosComercialesController::class, 'getGirosComercialesAPI']);