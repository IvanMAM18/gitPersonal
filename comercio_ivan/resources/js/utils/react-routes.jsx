const APP = "/app";

const routes = {
    // persona
    inicio: APP,
    login: "/login",
    misTramites: APP + "/mis-tramites",
    misTramitesDetalles: APP + "/mis-tramites/:tramiteId",
    misTramitesNegocioDetalles: APP + "/mis-tramites-negocio/:tramiteId",
    misNegocios: APP + "/mis-negocios",
    detallesNegocio: APP + "/mis-negocios/:negocioId",
    registrarNegocio: APP + "/registrar-negocio",
    completaTuPerfil: APP + "/expediente",
    actualizaPerfil: APP + "/actualiza-perfil",
    actualizaPersonaMoral: APP + "/actualiza-persona-moral",
    UMAS: APP + "/umas",

    // entidad revisora
    homeNegocios: APP + "/entidad-home",
    ayuda: APP + "/ayuda",

    // tramites
    iniciarTramite: APP + "/iniciar-tramite/:id/:slug",
    iniciarRefrendoLicenciaAlcohol: APP + "/iniciar-tramite/refrendo-de-licencia-de-alcoholes",

    revisionTramites: APP + "/revision-tramites",
    revisionNegocios: APP + "/revision-negocios",
    revisionNegociosProSare: APP + "/revision-negocios-pro-sare",
    detallesNegocioEntidad: APP + "/detalles-negocios-entidad/:negocioId/:year",
    detallesTramite: APP + "/tramites/:tramiteId/detalles",
    cambioTipoRecoleccion: APP + "/cambio-tipo-recoleccion/:negocioId/:year",
    local: APP + "/local",
    localAlta: APP + "/local/alta",
    localEdit: APP + "/local/edit/:id",
    negociosPadron: `${APP}/padron-negocios`,
    negociosMapa: `${APP}/mapa-negocios`,
    negociosMapaFilters: `${APP}/mapa-negocios-filters`,
    resolutivos: `${APP}/resolutivos`,
    resolutivosNegocio: `${APP}/resolutivos/:negocioId`,

    // comercio-admin
    comercioAdmin: APP + "/comercio-admin",
    comercioAdminNegocio: APP + "/comercio-admin/negocio/:negocioId/:year",
    comercionAdminHomeNegocios: APP + "/comercio-admin-home",
    comercioAdminBusquedaNegocio: APP + "/busqueda-negocios",
    comercioSarePro: APP + "/comercio-sare-pro",
    editarNegocioComercioAdmin: APP + "/comercio-admin/negocio/:negocioId/editar",

    //nuevo Alcoholes
    alcoholesCrud: APP + "/ligar-licencias",
    alcoholesCargaLicencias: APP + "/cargar-licencias",
    alcoholesVerLicencias: APP + "/ver-licencias-ligadas",
};

const allowedByRole = {
    Persona: [
        routes.misTramites,
        routes.misNegocios,
        // si la ruta incluye una variable esta regexp
        // lo cambia por el string __rid__ para poder compararla
        // en RolesRouter
        routes.misTramitesDetalles.replace(/:.+/g, "__rid__"),
        routes.misTramitesNegocioDetalles.replace(/:.+/g, "__rid__"),
        routes.detallesNegocio.replace(/:.+/g, "__rid__"),
        routes.registrarNegocio,
        routes.completaTuPerfil,
        routes.actualizaPerfil,
        routes.ayuda,
        routes.actualizaPersonaMoral,
        routes.iniciarTramite.replace(/:.+/g, "__rid__"),
        routes.iniciarRefrendoLicenciaAlcohol,
    ],

    EntidadRevisora: [
        routes.homeNegocios,
        routes.revisionTramites,
        routes.revisionNegocios,
        routes.revisionNegociosProSare,
        routes.detallesNegocioEntidad.replace(/:[^/]+/g, "__rid__"),
        routes.cambioTipoRecoleccion.replace(/:[^/]+/g, "__rid__"),
        routes.detallesTramite.replace(/:.+/g, "__rid__"),
        routes.local,
        routes.localAlta,
        routes.localEdit.replace(/:.+/g, "__rid__"),
        routes.negociosPadron,
        routes.negociosMapa,
        routes.negociosMapaFilters,
        routes.resolutivos,
        routes.resolutivosNegocio,
        routes.resolutivosNegocio.replace(/:.+/g, "__rid__"),
        routes.UMAS,
    ],
    EntidadRevisoraDirector: [
        routes.homeNegocios,
        routes.revisionTramites,
        routes.revisionNegocios,
        routes.revisionNegociosProSare,
        routes.negociosMapa,
        routes.negociosMapaFilters,
        routes.resolutivos,
        routes.resolutivosNegocio.replace(/:.+/g, "__rid__"),
        //routes.detallesNegocioEntidad.replace(/:.+/g, "__rid__"),
        routes.detallesNegocioEntidad.replace(/:[^/]+/g, "__rid__"),
        routes.cambioTipoRecoleccion.replace(/:[^/]+/g, "__rid__"),
        routes.detallesTramite.replace(/:.+/g, "__rid__"),
        routes.UMAS,
        routes.alcoholesCrud,
        routes.alcoholesCargaLicencias,
        routes.alcoholesVerLicencias,
        routes.editarNegocioComercioAdmin.replace(/:[^/]+/g, "__rid__"),
    ],
    comercio_admin: [
        routes.comercioAdmin,
        routes.comercioAdminNegocio.replace(/:.+/g, "__rid__"),
        routes.resolutivos,
        routes.resolutivosNegocio.replace(/:.+/g, "__rid__"),
        routes.detallesNegocioEntidad.replace(/:[^/]+/g, "__rid__"),
        routes.negociosMapaFilters,
        routes.comercionAdminHomeNegocios,
        routes.UMAS,
        routes.comercioAdminBusquedaNegocio,
        routes.comercioSarePro,

    ],
    ComercioDirector: [
        routes.comercioAdmin,
        routes.resolutivos,
        routes.resolutivosNegocio.replace(/:.+/g, "__rid__"),
        routes.detallesNegocioEntidad.replace(/:[^/]+/g, "__rid__"),
        routes.negociosMapaFilters,
        routes.UMAS,
        routes.comercioAdminBusquedaNegocio,
        routes.comercioSarePro,
        routes.alcoholesCrud,
        routes.revisionNegocios,
        routes.revisionTramites,
        routes.editarNegocioComercioAdmin.replace(/:[^/]+/g, "__rid__"),
    ],
    ComercioAdminVisor: [
        routes.comercioAdmin,
        routes.comercioAdminNegocio.replace(/:.+/g, "__rid__"),
        //routes.resolutivos,
        //routes.resolutivosNegocio.replace(/:.+/g, "__rid__"),
        routes.negociosMapaFilters,
        routes.comercionAdminHomeNegocios,
        routes.comercioSarePro,
    ],
};

routes.allowedByRole = allowedByRole;

export default routes;
