import axios from "axios";

export function filterNegociosByYear(negocios, year) {
    return negocios.filter(negocio => {
        if(negocio.id ===409)
            console.log({negocio},new Date(negocio?.tramite_padre?.[0]?.created_at).getFullYear())
        if (new Date(negocio?.tramite_padre?.[0]?.created_at).getFullYear() === new Date().getFullYear() - 1) {
            const tramiteComercio = negocio?.tramites_comercio?.find(tc => tc?.tramite?.catalogo_tramite?.nombre.toLowerCase().includes("uso de suelo"))
            if (tramiteComercio === null) return false;
            if (tramiteComercio?.tramite?.aviso_entero?.pagado === false) return false;
            if (tramiteComercio?.tramite?.ultima_revision?.status !== "APROBADO") return false;

        }
        if (negocio?.tramite_comercio_refrendo_current_year?.length >= 1) {
            return false;
        }
        if (negocio?.tramite_comercio_refrendo_current_year?.length === 0) {
            return true;
        }
        // Parse the timestamp and extract the year
        let createdAtYear = new Date(negocio?.tramite_comercio_refrendo_current_year?.[0]?.created_a).getFullYear();
        // Check if the year matches the desired year
        return createdAtYear === year;
    });
}

export function filterNegociosByNoYear(negocios, year) {
    return negocios.filter(negocio => {
        if (negocio?.tramite_comercio_refrendo_current_year?.length > 1) {
            return false;
        }
        // Parse the timestamp and extract the year
        let createdAtYear = new Date(negocio?.tramite_comercio_refrendo_current_year?.[0]?.created_at).getFullYear();
        // Check if the year matches the desired year
        return createdAtYear !== year;
    });
}
function esFederalOEjidal(tipoPredio) {
    return tipoPredio === "ejidal" || tipoPredio === "federal";
}

async function performPostRequest(negocio, token) {
    const postUrl = "/app/validar_predial_pagado"
    try {
        const respuesta = await axios
            .post(postUrl, {
                comercio_token: token,
                clave_folio: negocio?.clave_catastral,
                tipo_predial: negocio?.tipo_predio,
            });

        if (esFederalOEjidal(negocio?.tipo_predio_propiedad)) {
            return {
                label: negocio?.nombre_del_negocio,
                value: negocio?.id?.toString(),
                statusClaveCatastralMessage: "No se requiere pago",
                pagoClaveCatastral: true,
            }
        } else if (respuesta.data.message === "NOT_FOUND") {
            return {
                label: negocio?.nombre_del_negocio,
                value: negocio?.id?.toString(),
                statusClaveCatastralMessage: "Predial no encontrado",
                pagoClaveCatastral: false,
            }
        } else {
            if (respuesta.data === false) {
                return {
                    label: negocio?.nombre_del_negocio,
                    value: negocio?.id?.toString(),
                    statusClaveCatastralMessage: "Predial pagado",
                    pagoClaveCatastral: true,
                }
            } else {
                return {
                    label: negocio?.nombre_del_negocio,
                    value: negocio?.id?.toString(),
                    statusClaveCatastralMessage: <span>
                        Lo invitamos a realizar su pago <a
                            href={`https://predial-web.lapaz.gob.mx/?folio=${negocio?.clave_catastral}&tipo=${negocio?.tipo_predio}`}
                            target="_blank"
                        >click aquí</a>
                    </span>,
                    pagoClaveCatastral: false,
                }
            }
        }
    } catch (error) {
        throw error; // Rethrow the error if needed
    }
}

export const validateClaveCatastralDeNegocios = async (token, setNegocioAprobado, negocio) => {
    let statusValidacionCatastro = [];
    try {
        const results = await performPostRequest(negocio, token, statusValidacionCatastro)
        setNegocioAprobado(results);
    } catch (error) {
        console.error('Error during validation:', error);
    }

}

export const tipos_anuncio = [
    {
        tipo: "NO TENGO",
        value: "NO TENGO",
    },
    {
        tipo: "PINTADO Y MURAL",
        value: "PINTADO Y MURAL",
    },
    {
        tipo: "ESTRUCTURAL",
        value: "ESTRUCTURAL",
    },
    {
        tipo: "LUMINOSO",
        value: "LUMINOSO",
    },
    {
        tipo: "OTROS",
        value: "OTROS",
    },
];
export const datos_estadisticos_sector = [
    {
        tipo: "INDUSTRIAL",
        value: "INDUSTRIAL",
    },
    {
        tipo: "COMERCIAL",
        value: "COMERCIAL",
    },
    {
        tipo: "SERVICIOS",
        value: "SERVICIOS",
    },
];

export const getInitialValuesFromNegocio = (negocio, updatedInfo) => {
    const {
        tiene_anuncios_publicitarios,
        tipo_anuncio,
        leyenda_anuncio,
        lugar_instalacion,
        largo_anuncio,
        ancho_anuncio,
        sector,
        inversion,
        no_empleados_h,
        no_empleados_m,
        empleados_cap_diferentes,
        venta_alcohol,
        horarios,
        nivel_recoleccion_basura,
        tarifa_recoleccion_id,
        servicio_priv_recoleccion,
        tamano_empresa,
        superficie_m2,
        nombre_del_negocio,
        impacto_giro_comercial,
    } = negocio;
    const impactoAltoFromVentaAlcoholM2 = negocio?.venta_alcohol && negocio?.superficie_m2 > 150;
    return {
        tiene_anuncios_publicitarios: tiene_anuncios_publicitarios ?? !!tipo_anuncio ?? false,
        tipo_anuncio: tipo_anuncio,
        leyenda_anuncio: leyenda_anuncio,
        lugar_instalacion: lugar_instalacion,
        largo_anuncio: largo_anuncio,
        ancho_anuncio: ancho_anuncio,
        sector: sector,
        inversion: inversion,
        no_empleados_h: no_empleados_h,
        no_empleados_m: no_empleados_m,
        empleados_cap_diferentes: empleados_cap_diferentes,
        venta_alcohol: venta_alcohol,
        horarios: horarios,
        hasUpdates: false,
        nivel_recoleccion_basura: nivel_recoleccion_basura,
        tarifa_recoleccion_id: tarifa_recoleccion_id,
        servicio_priv_recoleccion: servicio_priv_recoleccion,
        tamano_empresa: tamano_empresa,
        superficie_m2: superficie_m2,
        nombre_del_negocio: nombre_del_negocio,
        impacto_giro_comercial: impactoAltoFromVentaAlcoholM2 ? "mediano_alto_impacto" : impacto_giro_comercial,
    }
};
export const getAnunciosValuesFromNegocio = (negocio) => {
    const {
        tipo_anuncio,
        leyenda_anuncio,
        lugar_instalacion,
        largo_anuncio,
        ancho_anuncio,

    } = negocio;
    return {

        tipo_anuncio: tipo_anuncio,
        leyenda_anuncio: leyenda_anuncio,
        lugar_instalacion: lugar_instalacion,
        largo_anuncio: largo_anuncio,
        ancho_anuncio: ancho_anuncio,

    }
};