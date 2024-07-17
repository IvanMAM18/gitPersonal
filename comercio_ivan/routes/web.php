<?php

use App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Ruta publica para ver el catalogo de giros comerciales
Route::get('/lista-de-giros-comerciales', [Controllers\ListaDeGirosComercialesController::class, 'index'])
    ->name('giros-comerciales');

//Ruta publica de preguntas frecuentes
Route::get('/preguntas-frecuentes-comercio', [Controllers\PreguntasFrecuentesController::class, 'index'])
    ->name('preguntas-frecuentes');

Route::get('/resolutivo/{resolutivo:folio}', [Controllers\ResolutivoController::class, 'getResolutivoViewByFolio']);
Route::get('/negocio/{negocio}/qr', [Controllers\CodigoQrNegocioController::class, 'show']);
Route::get('/informacion_negocio_detalles/{negocio}', [Controllers\NegocioController::class, 'getNegocioDetallesView']);
Route::get('/get_resolutivo_por_folio/{folio}', [Controllers\ResolutivoController::class, 'getResolutivoDataByFolio']);
Route::get('/get_tramite_persona_w_persona/{tramite_id}', [Controllers\ResolutivoController::class, 'getTramitePersona']);
Route::get('/get_resolutivo_pagados/{entidad_revisora_id}', [Controllers\ResolutivoController::class, 'getNegociosByPagoResolutivoAndER_']);
Route::get('/get_resolutivo_pagados_all/{entidad_revisora_id}', [Controllers\ResolutivoController::class, 'getNegociosByPagoResolutivoAndER_all']);

Route::get('/test_send_email', [Controllers\AdminCrudController::class, 'SendMail']);

Route::group(['middleware' => 'auth'], function () {
    Route::get('/local', [Controllers\PersonaController::class, 'index']);
});

Route::get('/data_codigos_postales_csv', [Controllers\SareCSVController::class, 'saveCSVCodigosPostales']);
Route::get('/data_condicionantes_csv', [Controllers\SareCSVController::class, 'condicionantes']);
//Route::get("/data_giros_csv", [SareCSVController::class, "saveCSVGiros"]);
Route::get('/data_sare_csv', [Controllers\SareCSVController::class, 'saveCSVInfo']);
Route::get('/data_denue_csv', [Controllers\SareCSVController::class, 'saveDenueCSVInfo']);
Route::get('/sare_join', [Controllers\SareCSVController::class, 'SareDenueJoinGetTableData']);
Route::get('/sare_denue_join_save', [Controllers\SareCSVController::class, 'SareDenueJoinSave']);
Route::get('/sare_denue_join_get_table_data', [Controllers\SareCSVController::class, 'SareDenueJoinGetTableData']);

Route::get('/', [Controllers\HomeController::class, 'index'])
    ->middleware('auth');

// Rutas de Autenticación
Auth::routes(['verify' => true]);

Route::get('/email/app/verificacion/{token}', [Controllers\Auth\AppEmailVerificationController::class, 'update']);
Route::get('/verification-in-app-completa', [Controllers\Auth\AppEmailVerificationController::class, 'show']);

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

//Route::post('/get-all-negocios-por-filtro-id-comercio-admin/{negocio_id}', [MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosOptPublico']);
Route::post('/get-all-negocios-opt-publico', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosOptPublico']);

Route::get('/aviso-de-privacidad-integral', [Controllers\AvisoDePrivacidadIntegralController::class, 'index'])
    ->name('aviso-de-privacidad-integral');
Route::get('/aviso-de-privacidad-simplificado', [Controllers\AvisoDePrivacidadSimplificadoController::class, 'index'])
    ->name('aviso-de-privacidad-simplificado');

// Probar si se siguen viendo los archivos.
//Route::get('/storage/uploads/{filepath}/{filename}', [Controllers\DocumentsController::class, 'show'])
//    ->middleware('auth');

Route::get('/1aa8ebf0-02a9-4ad3-8833-067c39a6d2ed', [Controllers\RefrendosByYearController::class, 'resetComprobanteDomicilioANegociosConRefrendo2024']);

Route::prefix('app')->group(function () {

    Route::get('/get_informacion_negocio_for_banner/{negocio}', [Controllers\NegocioController::class, 'detailsForNegocioQrBanner']);

    Route::get('/negocios_admin_all', [Controllers\NegocioCrudsController::class, 'getNegociosAdmin']);
    Route::get('/negocios_usuario_all', [Controllers\NegocioCrudsController::class, 'getNegociosUsuario']);
    Route::get('/get_direccion_por_id/{direccion_id}', [Controllers\NegocioCrudsController::class, 'getDireccionPorId']);
    Route::post('/actualizar_persona_moral', [Controllers\PersonasMoralesController::class, 'actualziarPersonaMoral']);
    Route::post('/crear_persona_moral', [Controllers\PersonasMoralesController::class, 'crearPersonaMoral']);
    Route::post('/actualizar_direccion_persona_moral', [Controllers\PersonasMoralesController::class, 'actualizarDireccionPersonaMoral']);
    Route::post('/guardar_direccion_persona_moral', [Controllers\PersonasMoralesController::class, 'crearDireccionPersonaMoral']);
    //    Route::get('/get_personas_morales_por_usuario_logeado', [Controllers\PersonasMoralesController::class, 'getPersonasMoralesPorUsuario']);

    Route::get('/get_negocio_direccion_por_id/{direccion_id}', [Controllers\NegocioCrudsController::class, 'getDireccionPorId']);

    Route::post('/update_direccion_negocio', [Controllers\DireccionesController::class, 'updateDireccionNegocio']);
    Route::post('/update_negocio_by_user', [Controllers\AdminCrudController::class, 'updateNegocioInfo']);

    // Camaras
    Route::get('/camaras_all', [Controllers\CamaraController::class, 'index']);

    // Roles
    Route::get('/roles_all', [Controllers\RolesController::class, 'index']);

    // Admin
    Route::middleware(['auth', 'verified', 'rol:superadmin'])->group(function () {
        Route::get('/admin-cruds', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/catalogo-tramites', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/catalogo-giros-comerciales', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/condicionantes', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/requisitos', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/subtramites', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/trabajadores', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/usuarios', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/autorizaciones', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/conceptos', [Controllers\AdminCrudController::class, 'index']);
        Route::get('/admin-cruds/umas', [Controllers\AdminCrudController::class, 'index']);
    });

    Route::get('/get_user_data_by_id/{id}', [Controllers\AdminCrudController::class, 'getUserDataById'])
        ->middleware('auth');
    Route::post('/actualizar_usuario', [Controllers\AdminCrudController::class, 'actualizarUsuario'])
        ->middleware('auth');

    Route::get('/dashadmin_get_todos_los_tramites', [Controllers\AdminCrudController::class, 'getTramites'])
        ->middleware('auth');
    Route::post('/dashadmin_tramites_store', [Controllers\AdminCrudController::class, 'storeTramite']);
    Route::post('/dashadmin_tramites_update ', [Controllers\AdminCrudController::class, 'updateTramite']);

    /// PELIGROSISIMO QUE ESTA RUTA NO ESTE PROTEGIDA
    Route::delete('/eliminar_giros/{g}', [Controllers\AdminCrudController::class, 'deleteGiro'])
        ->middleware('auth', 'rol:superadmin');

    Route::get('/dashadmin_get_todos_los_giros', [Controllers\AdminCrudController::class, 'getGiros']);
    Route::post('/dashadmin_giros_store', [Controllers\AdminCrudController::class, 'storeGiro']);
    Route::post('/dashadmin_giros_update ', [Controllers\AdminCrudController::class, 'updateGiro']);
    Route::delete('/eliminar_tramites/{t}', [Controllers\AdminCrudController::class, 'deleteTramite']);
    Route::get('/get_servicios_publicos_para_giros_comerciales', [Controllers\AdminCrudController::class, 'getServiciosPublicosParaGiros']);

    // llamadas para el mapa
    Route::get('/get-all-negocios-for-markers/{entidad_revision}', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegociosForMarkers']);
    // Route::get('/get-all-negocios-alcohol/{entidad_revision}', [MapaEntidadRevisoraController::class, 'getAllNegocioAlcoholLicencia']);
    Route::get('/get-all-negocios-por-impacto/{entidad_revision}/{impacto_giro_comercial}', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegociosPorImpacto']);
    Route::get('/get-all-negocios-por-alcohol/{entidad_revision}/{licencia_alcohol}', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioAlcoholLicencia']);

    Route::post('/get-all-negocios-por-filtro', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltros']);
    Route::post('/get-all-negocios-por-filtro-opt', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosOpt']);
    Route::post('/get-all-negocios-por-filtro-id/{negocio_id}', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosById']);
    Route::post('/get-all-negocios-por-filtro-comercio-admin', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosComercioAdmin']);
    Route::post('/get-all-negocios-por-filtro-comercio-admin-opt', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosOptComercioAdmin']);
    Route::post('/get-all-negocios-por-filtro-id-comercio-admin/{negocio_id}', [Controllers\MapaEntidadRevisoraController::class, 'getAllNegocioPorFiltrosIdComercioAdmin']);

    Route::get('/dashadmin_get_todos_los_subtramites', [Controllers\AdminCrudController::class, 'getSubtramites']);
    Route::post('/dashadmin_subtramites_store', [Controllers\AdminCrudController::class, 'storeSubtramite']);
    Route::post('/dashadmin_subtramites_update ', [Controllers\AdminCrudController::class, 'updateSubtramite']);
    Route::delete('/eliminar_subtramites/{st}', [Controllers\AdminCrudController::class, 'deleteSubtramite']);

    Route::get('/dashadmin_get_todas_las_entidades_revisoras', [Controllers\AdminCrudController::class, 'getEntidadesRevisoras']);

    Route::get('/dashadmin_get_todos_los_condicionantes', [Controllers\AdminCrudController::class, 'getCondicionantes']);
    Route::post('/dashadmin_condicionantes_store', [Controllers\AdminCrudController::class, 'storeCondicionante']);
    Route::post('/dashadmin_condicionantes_update ', [Controllers\AdminCrudController::class, 'updateCondicionante']);
    Route::delete('/eliminar_condicionantes/{c}', [Controllers\AdminCrudController::class, 'deleteCondicionante']);

    Route::get('/dashadmin_get_todos_los_requisitos', [Controllers\AdminCrudController::class, 'getRequisitos']);
    Route::post('/dashadmin_requisitos_store', [Controllers\AdminCrudController::class, 'storeRequisito']);
    Route::post('/dashadmin_requisitos_update ', [Controllers\AdminCrudController::class, 'updateRequisito']);
    Route::delete('/eliminar_requisitos/{r}', [Controllers\AdminCrudController::class, 'deleteRequisito']);

    Route::get('/dashadmin_get_todos_los_trabajadores', [Controllers\AdminCrudController::class, 'getTrabajadores']);
    Route::post('/dashadmin_trabajadores_store', [Controllers\AdminCrudController::class, 'storeTrabajador']);
    Route::post('/dashadmin_trabajadores_update ', [Controllers\AdminCrudController::class, 'updateTrabajador']);
    Route::delete('/eliminar_trabajadores/{t}', [Controllers\AdminCrudController::class, 'deleteTrabajador']);

    Route::get('/dashadmin_get_todos_los_usuarios', [Controllers\AdminCrudController::class, 'getUsuarios']);
    Route::post('/dashadmin_usuarios_store', [Controllers\AdminCrudController::class, 'storeUsuario']);
    Route::post('/dashadmin_usuarios_update ', [Controllers\AdminCrudController::class, 'updateUsuario']);
    Route::post('/dashadmin_usuarios_update_password ', [Controllers\AdminCrudController::class, 'updatePasswordUsuario']);
    Route::delete('/eliminar_usuarios/{u}', [Controllers\AdminCrudController::class, 'deleteUsuario']);

    Route::get('/dashadmin_get_todos_los_conceptos', [Controllers\AdminCrudController::class, 'getConceptos']);
    Route::post('/dashadmin_conceptos_store', [Controllers\AdminCrudController::class, 'storeConcepto']);
    Route::post('/dashadmin_conceptos_update ', [Controllers\AdminCrudController::class, 'updateConcepto']);
    Route::delete('/eliminar_conceptos/{concepto}', [Controllers\AdminCrudController::class, 'deleteConcepto']);
    Route::get('/get_colonia_from_codigos_postales_by_id/{colonia_id}', [Controllers\AdminCrudController::class, 'getColoniaById']);
    Route::get('/get_tarifa_recoleccion_basura_info_by_id/{tarifa_recoleccion_id}', [Controllers\AdminCrudController::class, 'getRecoleccionBasuraInfoByTarifaId']);
    Route::get('/validar_rfc', [Controllers\AdminCrudController::class, 'validarRFC']);

    Route::get('/all-umas', [Controllers\UMAController::class, 'getAllUMAS']);
    Route::post('/delete-uma', [Controllers\UMAController::class, 'deleteUMA']);
    Route::post('/edit-uma', [Controllers\UMAController::class, 'editUMA']);
    Route::post('/add-uma', [Controllers\UMAController::class, 'addUMA']);

    Route::get('/get_giros_comerciales_registro', [Controllers\GirosComercialesController::class, 'getGirosComerciales']);
    Route::get('/giros-de-negocio/{negocio_id}', [Controllers\GirosComercialesController::class, 'getGirosNegocio']);
    Route::put('/negocio-giros/{negocio_id}', [Controllers\GirosComercialesController::class, 'updateGirosNegocio']);
    Route::get('/get_giros_comerciales_recoleccion_basura', [Controllers\RecoleccionBasuraController::class, 'getGirosComerciales']);
    Route::post('/get_tarifa_by_giro_comercial_recoleccion_basura', [Controllers\RecoleccionBasuraController::class, 'getTarifasByGiroComercial']);

    // Catastro API
    Route::get('/get_comercio_token', [Controllers\ValidarPredialPagadoController::class, 'getComercioToken']);
    Route::post('/validar_predial_pagado', [Controllers\ValidarPredialPagadoController::class, 'validatePredialPagado']);
    Route::post('/get_info_123_', [Controllers\ValidarPredialPagadoController::class, 'getInfo']);

    // Home
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/comercio-sare-pro', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/resolutivos', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/padron-negocios', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/mapa-negocios', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/mapa-negocios-filters', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/mis-tramites', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/mis-negocios', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/mis-negocios/{negocio_id}', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/mis-negocios/{negocio_id}/tramite/{tramite_id}', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/resolutivos/{negocio_id}', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/expediente', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/actualiza-perfil', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/actualiza-persona-moral', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/ayuda', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/registrar-negocio', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/revision-negocios', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/revision-negocios-pro-sare', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/entidad-home', [Controllers\ComercioController::class, 'render_react_router_root'])
            ->middleware(['auth', 'rol:entidad-revisora']);
        Route::get('/detalles-negocios-entidad/{negocio_id}/{year}', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/local', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/local/alta', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/umas', [Controllers\ComercioController::class, 'render_react_router_root']);
        // comercio_admin
        Route::get('/comercio-admin', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/comercio-admin/negocio/{negocio_id}/{year}', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/comercio-admin-home', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/busqueda-negocios', [Controllers\ComercioController::class, 'render_react_router_root']);
        // requisitos
        //Alcoholes
        Route::get('/ligar-licencias', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/ver-licencias-ligadas', [Controllers\ComercioController::class, 'render_react_router_root']);
        Route::get('/cargar-licencias', [Controllers\ComercioController::class, 'render_react_router_root']);
    });

    Route::get('/get-licencias', [Controllers\LicenciaAlcoholController::class, 'getLicencias']);
    Route::get('/contribuyentes/{year}/con-licencia-de-alcoholes', [Controllers\ContribuyentesConLicenciaDeAlcoholesController::class, 'index'])
        ->middleware('auth')
        ->name('contribuyentes-con-licencia-de-alcholes');

    Route::get('/get-negocios-no-licencia/{year}', [Controllers\LicenciaAlcoholController::class, 'getSinLicenciaNegocios']);
    Route::get('/get-licencia-negocios', [Controllers\LicenciaAlcoholController::class, 'getLicenciaNegocios']);
    Route::post('/licencia-negocio', [Controllers\LicenciaAlcoholController::class, 'store']);
    Route::post('/desligar-licencia-negocio', [Controllers\LicenciaAlcoholController::class, 'desligarLicenciaNegocio']);

    //Reportes
    Route::get('/reportes', [Controllers\ComercioController::class, 'render_react_router_root'])
        ->middleware('auth');
    Route::get('/generar-firma-reporte-tiempos/{year}', [Controllers\ReporteController::class, 'get_url_reporte_firmado']);
    Route::get('/generar-firma-reporte-padron/{year}', [Controllers\ReporteController::class, 'get_url_reporte_padron_firmado']);
    Route::get('/generar-firma-reporte-padron-servicios-publicos/{year}', [Controllers\ReporteController::class, 'get_url_reporte_padron_servicios_publicos_firmado']);
    Route::get('/get-reporte-tiempos/{year}', [Controllers\ReporteController::class, 'getReporteTiempos'])
        ->middleware('signed')
        ->name('get-reporte-tiempos');
    Route::get('/get-reporte-padron/{year}', [Controllers\ReporteController::class, 'getReportePadron'])
        ->middleware('signed')
        ->name('get-reporte-padron');
    Route::get('/get-reporte-padron-servicios-publicos/{year}', [Controllers\ReporteController::class, 'getReportePadronServiciosPublicos'])
        ->middleware('signed')
        ->name('get-reporte-padron-servicios-publicos');

    Route::get('/requisitos-list', [Controllers\NegocioController::class, 'getRequisitos']);
    Route::get('/get-details-no-documents/{negocio_id}', [Controllers\NegocioController::class, 'getDetailsNoDocuments']);
    Route::get('/get-entidad-documentos/{negocio_id}', [Controllers\NegocioController::class, 'getEntidadDocumentos']);
    Route::post('/approve-revision', [Controllers\NegocioController::class, 'aprobarRevision'])
        ->middleware('auth');
    Route::post('/reject-revision', [Controllers\NegocioController::class, 'rechazarRevision']);
    Route::post('/new-revision', [Controllers\NegocioController::class, 'newRevision']);
    Route::post('/get-observaciones', [Controllers\NegocioController::class, 'getObservaciones']);
    Route::get('/get-negocios-requisitos-json', [Controllers\NegocioController::class, 'getNegociosRequisitosJSON']);
    Route::get('/get-negocios-requisitos-rechazados-json', [Controllers\NegocioController::class, 'getNegociosRequisitosRechazadosJSON']);
    Route::get('/es-programa-interno/{negocio_id}', [Controllers\NegocioController::class, 'documentoProgramaInterno']);

    // condicionantes
    Route::get('/condicionantes', [Controllers\CondicionantesController::class, 'getAllCondicionantes']);
    Route::get('/get-condicionantes-por-negocio/{negocio_id}/{entidad_revision}', [Controllers\CondicionantesController::class, 'getCondicionantesPorNegocio']);

    // Condicionantes por Entidad Revision.
    Route::get('/entidad-revision/{entidad_revision}/condicionantes', [Controllers\EntidadRevisionCondicionantesController::class, 'index'])
        ->middleware('auth');

    // app api
    Route::get('/negocios', [Controllers\NegocioController::class, 'all'])
        ->middleware('auth');
    Route::get('/tramites', [Controllers\NegocioController::class, 'tramites'])
        ->middleware('auth');

    Route::get('/negocios-not-approved/{entidad_revision}', [Controllers\NegocioController::class, 'allNotApproved']);
    Route::get('/entidad-revision/revision-de-negocios', [Controllers\EntidadRevisionNegociosController::class, 'index'])
        ->middleware(['auth', 'rol:entidad-revisora,comercio-director']);

    //sare
    Route::get('/negocios-not-approved-sare/{entidad_revision}/{selected_year}', [Controllers\NegocioController::class, 'allNotApprovedSare']);
    Route::post('/negocios-by-filters-sare', [Controllers\NegocioController::class, 'getNegociosByFiltersSare']);

    Route::get('/negocios-by-name/{entidad_revision}/{filter_parameter}/{filter_parameter_value}', [Controllers\NegocioController::class, 'getNegociosByName']);
    Route::get('/negocios-by-id/{entidad_revision}/{filter_parameter}/{filter_parameter_value}', [Controllers\NegocioController::class, 'getNegociosByID']);
    Route::get('/negocios-by-status/{entidad_revision}/{filter_parameter_value}', [Controllers\NegocioController::class, 'getNegociosByStatus']);
    Route::get('/negocio/tramite/{tramite}', [Controllers\NegocioController::class, 'detallesPorTramite'])
        ->middleware(['auth']);
    Route::post('/negocio', [Controllers\NegocioController::class, 'store']);
    Route::post('/guardar-negocio/{negocio}', [Controllers\EditarNegocioComercioAdminController::class, 'update']);
    Route::patch('/actualizar-campo-negocio/{negocio}', [Controllers\EditarNegocioComercioAdminController::class, 'updateField']);

    // Negocios
    Route::get('/negocio/{negocio}', [Controllers\NegocioController::class, 'show'])
        ->middleware('auth');
    Route::post('/negocio', [Controllers\NegocioController::class, 'store'])
        ->middleware('auth');
    Route::get('/negocio-entidad-revisora/{negocio_id}/{entidad_revisora_id}/{selected_year}', [Controllers\NegocioController::class, 'detailsEntidadRevisora']);
    Route::get('/crear-revision-para-entidad-revisora/{negocio}', [Controllers\ComercioAdminController::class, 'crearRevisionParaEntidadRevisora']);
    Route::get('/get-tramite-padre/{entidad_revision}', [Controllers\NegocioController::class, 'getTramitePadre']);

    Route::get('/negocioCargaMasiva', [Controllers\NegocioCargaMasivaController::class, 'store']);
    Route::post('/borrar-negocio/{negocio}', [Controllers\NegocioController::class, 'borrarNegocio']);

    Route::get('/requisitos', [Controllers\RequisitoController::class, 'all'])
        ->middleware('auth');

    Route::get('/personas-morales', [Controllers\ComercioController::class, 'index'])
        ->middleware('auth');
    Route::post('/update-impacto-giro-comercial', [Controllers\NegocioController::class, 'updateImpactoGiroComercial']);
    Route::post('/rechazar-documento', [Controllers\NegocioController::class, 'rechazarDocumento']);
    Route::post('/borrar-documento', [Controllers\NegocioController::class, 'quitarDocumento']);
    Route::post('/aprobar-documento', [Controllers\NegocioController::class, 'aprobarDocumento']);
    Route::post('/create-subtramites-orden-uno', [Controllers\NegocioController::class, 'createSubtramitesOrderOne']);

    Route::get('/datos-faltantes-de-negocios', [Controllers\DatosFaltantesController::class, 'datosFaltantesNegocio'])
        ->middleware('auth');
    Route::post('/datos-faltantes-de-negocios', [Controllers\DatosFaltantesController::class, 'completar']);
    Route::get('/negocio-valida-programa-interno/{negocio}/{anio}', [Controllers\ValidarProgramaInternoController::class, 'index'])
    ->middleware('auth');

    // negocios activos
    Route::get('/comercio-admin/negocios/{negocio}', [Controllers\ComercioAdminController::class, 'obtenerNegocio']);
    Route::get('/comercio-admin/negocios-en-revision', [Controllers\RevisionDeNegociosComercioAdminController::class, 'index'])
        ->middleware(['auth']);
    Route::get('/comercio-admin/detalles-revision/{revision}', [Controllers\RevisionesController::class, 'show'])
        ->middleware(['auth']);
    Route::post('/comercio-admin/tramite/{tramite}/validar', [Controllers\ValidarTramiteController::class, 'store']);
    Route::post('/observaciones-comercio-admin', [Controllers\ComercioAdminController::class, 'observaciones']);
    Route::get('/comercio-admin/busqueda-negocios-en-revision', [Controllers\ComercioAdminBusquedaNegocioController::class, 'negociosEnRevision']);

    // uploads
    Route::post('/uploads/acta-constitutiva', [Controllers\UploadsController::class, 'acta_constitutiva']);
    Route::post('/uploads/predio-propiedad', [Controllers\UploadsController::class, 'documento_predio_propiedad']);
    Route::post('/uploads/predio-playa-ejidal', [Controllers\UploadsController::class, 'predio_playa_ejidal']);
    Route::post('/uploads/foto-frontal-negocio', [Controllers\UploadsController::class, 'foto_frontal_negocio']);
    Route::put('/uploads/acta-constitutiva', [Controllers\UploadsController::class, 'update_acta_constitutiva']);
    Route::post('/uploads/comprobante-domicilio-negocio', [Controllers\UploadsController::class, 'comprobante_domicilio_negocio']);
    Route::post('/file-profile-update/{nombre_del_documento}', [Controllers\UploadsController::class, 'any']);
    Route::post('/file-expediente/{nombre_del_documento}', [Controllers\UploadsController::class, 'expediente']);
    Route::post('/file-negocio-profile-update/{nombre_del_documento}', [Controllers\UploadsController::class, 'anyNegocio']);

    //Resolutivos
    Route::get('/detalles_negocio_para_resolutivos_por_id/{negocio_id}/{year}', [Controllers\NegocioController::class, 'detallesResolutivos']);
    Route::get('/detalles_negocio_para_resolutivos_por_id_alcoholes/{negocio_id}', [Controllers\ResolutivoController::class, 'detallesResolutivosAlcohol']);
    Route::get('/get_negocios_por_entidad_revisora_resolutivo_pago_info/{entidad_revisora_id}/{year}', [Controllers\ResolutivoController::class, 'getNegociosByPagoResolutivoAndER'])
        ->middleware('auth');
    Route::get('/get_negocios_alcoholes_resolutivo_pago_info/{entidad_revisora_id}/{year}', [Controllers\ResolutivoController::class, 'getNegociosByPagoResolutivoAlcoholes']);
    Route::get('/get_direccion_notificacion_del_negocio/{direccion_notificacion_id}', [Controllers\ResolutivoController::class, 'getDireccionNotificacionNegocio']);
    Route::get('/get_check_resolutivos_por_negocio_entidad_revisora_id', [Controllers\ResolutivoController::class, 'checkAndGetResolutivoPorNegocioAndER']);
    Route::get('/get_check_resolutivos_por_negocio_entidad_revisora_id_obs', [Controllers\ResolutivoController::class, 'checkAndGetResolutivoPorNegocioERAndObservaciones']);
    Route::post('/firmar_resolutivo', [Controllers\ResolutivoController::class, 'firmarResolutivo']);
    Route::post('/firmar_resolutivo_por_id', [Controllers\ResolutivoController::class, 'firmarResolutivoPorId']);
    Route::get('/get_tramites_con_tramite_persona', [Controllers\ResolutivoController::class, 'getTramitesConTramitePersona']);
    Route::get('/get_tramites_con_tramite_persona_alcoholes', [Controllers\ResolutivoController::class, 'getTramitesConTramitePersonaAlcoholes']);

    // Servicios Publicos
    Route::get('/cambio-tipo-recoleccion/{negocio_id}/{year}', [Controllers\ComercioController::class, 'render_react_router_root'])
        ->middleware('auth');
    Route::post('/get-uma-recoleccion', [Controllers\UMAController::class, 'getUMARecoleccion']);
    Route::post('/update-recoleccion-publico', [Controllers\NegocioController::class, 'updateRecoleccionPublico']);
    Route::post('/update-recoleccion-privado', [Controllers\NegocioController::class, 'updateRecoleccionPrivado']);
    Route::post('/catalogo-servicio-privado-recoleccion-basura', [Controllers\CatalogoServicioPrivadoRecoleccionBasuraController::class, 'index']);
    Route::post('/enviar-mensaje-telegram', [Controllers\BotTelegramController::class, 'enviarMensaje']);

    //Tramites
    Route::get('/avisos-enteros/{avisoEntero}/pdf', [Controllers\PagosController::class, 'obtenerPDFAvisoEntero']);

    Route::get('/get-subtramites/{tramite_padre}', [Controllers\NegocioController::class, 'getSubtramitesFromTramitePadre']);
    Route::get('/get_entidad_revisora_director_rol_id', [Controllers\AdminCrudController::class, 'getEntidadRevisoraDirectorRolId']);
    Route::get('/get_entidad_revisora_comercio_admin_director_rol_id', [Controllers\AdminCrudController::class, 'getEntidadRevisoraComercioAdminDirectorRolId']);
    Route::post('/save_resolutivo_info', [Controllers\ResolutivoController::class, 'saveResolutivoInfo']);
    Route::post('/save_resolutivo_licencia_funcionamiento', [Controllers\ResolutivoController::class, 'saveResolutivoLicenciaFuncionamiento']);
    Route::post('/save_resolutivo_proteccion_civil', [Controllers\ResolutivoController::class, 'saveResolutivoProteccionCivil']);
    Route::post('/save_resolutivos_contraloria', [Controllers\ResolutivoController::class, 'saveResolutivosContaloria']);
    Route::get('/get_resolutivo_image', [Controllers\ResolutivoController::class, 'getResolutivoImage']);
    Route::get('/get_resolutivos_por_entidad_revisora_id/{entidad_revisora_id}', [Controllers\ResolutivoController::class, 'getResolutivosPorEntidadRevisora']);
    Route::get('/get_entidades_revisoras', [Controllers\AdminCrudController::class, 'getEntidadesRevisoras']);
    Route::get('/get_codigos_postales', [Controllers\AdminCrudController::class, 'getCodigosPostales']);
    Route::get('/get_codigos_postales_from_bcs', [Controllers\AdminCrudController::class, 'getCodigosPostalesFromBCS']);
    Route::get('/get_colonias_by_codigo_postal/{codigo_postal}', [Controllers\AdminCrudController::class, 'getColoniasByCodigoPostal']);
    Route::get('/detalles-by-year', [Controllers\NegocioController::class, 'getTramitesCondicionantesDocumentosNegociosByYear']);

    Route::get('/expediente-completado/{user}', [Controllers\PersonaController::class, 'expediente_completado'])
        ->middleware('auth');

    Route::get('/avisos-enteros/{avisoEntero}/pdf', [Controllers\PagosController::class, 'obtenerPDFAvisoEntero']);

    // Estadísticas Comercio Admin:
    //    Route::get('/comercio-admin-totales', [Controllers\EstadisticasComercioAdminController::class, 'getTotales']);
    //    Route::get('/comercio-admin-rechazados', [Controllers\EstadisticasComercioAdminController::class, 'getTotalRechazados']);
    //    Route::get('/comercio-admin-tramites-recibidos', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesRecibidos']);
    //    Route::get('/comercio-admin-tramites-con-observacion', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesConObservacion']);
    //    Route::get('/comercio-admin-tramites-validados', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesValidados']);
    //    Route::get('/comercio-admin-tramites-rechazados', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesRechazados']);
    //    Route::get('/comercio-admin-tramites-pendientes-revision', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesPendientesRevision2']);
    //    Route::get('/comercio-admin-tramites-pendientes-aviso-entero', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesPendientesAvisoDeEntero']);
    //    Route::get('/comercio-admin-tramites-pendientes-pago', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesPendientesPago']);
    //    Route::get('/comercio-admin-tramites-pagados', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesPagados']);
    //    Route::get('/comercio-admin-tramites-resolutivo-impreso', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesResolutivoImpreso']);
    //    Route::get('/comercio-admin-tramites-resolutivo-no-impreso', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesResolutivoNoImpreso']);
    //    Route::get('/comercio-admin-tramites-con-alcohol', [Controllers\EstadisticasComercioAdminController::class, 'getTramitesConAlcohol']);

    // Estadisticas Entidad Revisora
    Route::get('/estadisticas-entidad-revisora/{estadistica}', [Controllers\EstadisticasEntidadRevisoraController::class, 'index'])
        ->middleware('auth', 'rol:entidad-revisora');

    // Tramite
    Route::get('/iniciar-tramite/{catalogo_tramite_id}/{catalogo_tramite_slug}', [Controllers\ComercioController::class, 'render_react_router_root'])
        ->middleware('auth');
    Route::post('/iniciar-tramite', [Controllers\TramiteController::class, 'iniciarTramite']);
    Route::get('/iniciar-tramite/refrendo-de-licencia-de-alcoholes', [Controllers\ComercioController::class, 'render_react_router_root'])
        ->middleware('auth');

    Route::post('/iniciar-tramite/refrendo-de-licencia-de-alcoholes', [Controllers\RefrendoLicenciaDeAlcoholes::class, 'store']);
    //    Route::post('/iniciar-tramite/refrendo-de-licencia-de-alcoholes', [Controllers\TramiteController::class, 'iniciarRefrendoLicenciaDeAlcoholes']);

    Route::get('/catalogo-tramites/{catalogo_Tramite_id}', [Controllers\CatalogoTramiteController::class, 'find']);
    Route::get('/mis-tramites/{tramite_id}', [Controllers\ComercioController::class, 'render_react_router_root'])
        ->middleware('auth');
    Route::get('/mis-tramites-negocio/{tramite_id}', [Controllers\ComercioController::class, 'render_react_router_root'])
        ->middleware('auth');
    Route::get('/tramites/{tramite_id}', [Controllers\TramiteController::class, 'detallesTramitePadre'])
        ->middleware('auth');
    Route::get('/revision-tramites', [Controllers\ComercioController::class, 'render_react_router_root'])
        ->middleware('auth');
    Route::post('/responder-requisito', [Controllers\RequisitoRevisionController::class, 'storeRequisitoPersona']);
    Route::get('/tramites/{tramiteId}/detalles', [Controllers\ComercioController::class, 'render_react_router_root'])
        ->middleware('auth');
    Route::post('/importar/licencias-alcoholes', [Controllers\TramiteController::class, 'importarLicenciasAlcohol']);
    Route::post('/crear_refrendos_para_año_en_curso', [Controllers\RefrendosByYearController::class, 'CrearRefrendosParaAñoEnCurso']);
    Route::post('/crear_refrendo_individual', [Controllers\RefrendosByYearController::class, 'CrearRefrendoIndividualParaAñoEnCurso'])
        ->middleware('auth');
});

Route::get('/entidad-revision/tramite/por-negocio', [Controllers\EntidadRevisionController::class, 'obtenerTramitePorNegocio'])
    ->middleware(['auth']);
Route::get('/entidad-revision/catalogo-tramites/{catalogoTramite}/conceptos', [Controllers\EntidadRevisionController::class, 'obtenerConceptos']);
Route::get('/entidad-revision/conceptos/{concepto}/detalles', [Controllers\EntidadRevisionController::class, 'obtenerConceptoDetalles']);
Route::get('/entidad-revision/concepto-detalles/{conceptoDetalle}/incisos', [Controllers\EntidadRevisionController::class, 'calcularDetallesIncisos']);
Route::post('/entidad-revision/concepto-detalles/{conceptoDetalle}/incisos/calcular', [Controllers\EntidadRevisionController::class, 'calcularDetallesIncisos']);
Route::post('/entidad-revision/pagos', [Controllers\PagosController::class, 'store'])
    ->middleware(['auth']);

Route::get('/entidad-revision/avisos-enteros/{avisoEntero}/pdf', [Controllers\PagosController::class, 'obtenerPDFAvisoEntero'])
    ->middleware(['auth']);

Route::get('/entidad-revision/tramites/en-revision', [Controllers\EntidadRevisionController::class, 'tramitesEnRevision'])
    ->middleware(['auth', 'rol:entidad-revisora,comercio-director']);
Route::get('/entidad-revision/tramites/{tramiteId}/detalles', [Controllers\EntidadRevisionController::class, 'detallesTramitePadre']);
Route::get('/entidad-revision/tramites/{tramiteId}/aprobar', [Controllers\TramiteController::class, 'aprobar']);
Route::get('/entidad-revision/tramites/{tramiteId}/rechazar', [Controllers\TramiteController::class, 'rechazar']);
Route::post('/entidad-revision/tramites/{tramiteId}/revision', [Controllers\TramiteController::class, 'revision']);

Route::get('/entidad-revision/requisitos', [Controllers\EntidadRevisionController::class, 'obtenerDocumentos']);
