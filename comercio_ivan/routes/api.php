<?php

use App\Http\Controllers\ExternalServiceController;
use App\Http\Controllers\NegocioController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\AvisoEnteroMultasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:api')
    ->post('/negocios/{negocio}/aviso-de-entero', [AvisoEnteroMultasController::class, 'index']);

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
