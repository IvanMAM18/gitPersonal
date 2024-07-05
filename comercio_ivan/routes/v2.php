<?php

use App\Http\Controllers\Api;

// Giros Comerciales
Route::get('/giros-comerciales', [Api\GirosComercialesController::class, 'index']);

Route::middleware('auth')->group(function () {

    // Roles
    Route::get('/roles', [Api\RolesController::class, 'index']);
    Route::post('/roles', [Api\RolesController::class, 'store']);
    Route::put('/roles/{role}', [Api\RolesController::class, 'update']);
    Route::delete('/roles/{role}', [Api\RolesController::class, 'destroy']);

    // Rol Permisos
    Route::put('/roles/{role}/permissions', [Api\RolesPermisosController::class, 'update']);

    // Permisos
    Route::get('/permissions', [Api\PermissionsController::class, 'index']);
    Route::post('/permissions', [Api\PermissionsController::class, 'store']);
    Route::put('/permissions/{permission}', [Api\PermissionsController::class, 'update']);
    Route::delete('/permissions/{permission}', [Api\PermissionsController::class, 'destroy']);

    // Usuarios
    Route::get('/usuarios', [Api\UsuariosController::class, 'index']);
    Route::post('/usuarios', [Api\UsuariosController::class, 'store']);
    Route::put('/usuarios/{user}', [Api\UsuariosController::class, 'update']);
    Route::delete('/usuarios/{user}', [Api\UsuariosController::class, 'destroy']);

    // Usuario Contraseña
    Route::put('/usuarios/{user}/password', [Api\UsuarioPasswordController::class, 'update']);

    // Usuario Roles
    Route::put('/usuarios/{user}/roles', [Api\UsuarioRolesController::class, 'update']);

    // Entidades Revisoras
    Route::get('/entidad-revisoras', [Api\EntidadRevisorasController::class, 'index']);
    Route::post('/entidad-revisoras', [Api\EntidadRevisorasController::class, 'store']);
    Route::put('/entidad-revisoras/{entidad_revisora}', [Api\EntidadRevisorasController::class, 'update']);
    Route::delete('/entidad-revisoras/{entidad_revisora}', [Api\EntidadRevisorasController::class, 'destroy']);
});
