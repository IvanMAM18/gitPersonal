import axios from "axios";

export function filterNegociosByYear(negocios, year) {
    return negocios.filter(negocio => {
        if (new Date(negocio?.tramite_comercio_padre?.created_at).getFullYear() === new Date().getFullYear() - 1) {
            const tramiteComercio = negocio?.tramites_comercio?.find(tc => tc?.tramite?.catalogo_tramite?.nombre.toLowerCase().includes("uso de suelo"))
            if (tramiteComercio === null) return false;
            if (tramiteComercio?.tramite?.aviso_entero?.pagado === false) return false;
            if (tramiteComercio?.tramite?.ultima_revision?.status !== "APROBADO") return false;

        }

        if (negocio?.tramite_comercio_refrendo_current_year?.length > 1 || new Date(negocio?.created_at).getFullYear() === year) {
            return false;
        }
        if (negocio?.tramite_comercio_refrendo_current_year?.length === 0) {
            return true;
        }
        // Parse the timestamp and extract the year
        let createdAtYear = new Date(negocio?.tramite_comercio_refrendo_current_year?.[0]?.created_at).getFullYear();
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

async function performPostRequest(negocio, token, negociosValidos) {
    const postUrl = "/app/validar_predial_pagado"
    try {
        const respuesta = await axios
            .post(postUrl, {
                comercio_token: token,
                clave_folio: negocio?.clave_catastral,
                tipo_predial: negocio?.tipo_predio,
            });

        if (esFederalOEjidal(negocio?.tipo_predio_propiedad)) {
            negociosValidos = [...negociosValidos, {
                label: negocio?.nombre_del_negocio,
                value: negocio?.id?.toString(),
                statusClaveCatastralMessage: "No se requiere pago",
                pagoClaveCatastral: true,
                tramites: negocio?.tramites ?? []
            }]
        } else if (respuesta.data.message === "NOT_FOUND") {
            negociosValidos = [...negociosValidos, {
                label: negocio?.nombre_del_negocio,
                value: negocio?.id?.toString(),
                statusClaveCatastralMessage: "Predial no encontrado",
                pagoClaveCatastral: false,
            }]
        } else {
            if (respuesta.data === false) {
                negociosValidos = [...negociosValidos, {
                    label: negocio?.nombre_del_negocio,
                    value: negocio?.id?.toString(),
                    statusClaveCatastralMessage: "Predial pagado",
                    pagoClaveCatastral: true,
                    tramites: negocio?.tramites ?? [],
                }]
            } else {
                negociosValidos = [...negociosValidos, {
                    label: negocio?.nombre_del_negocio,
                    value: negocio?.id?.toString(),
                    statusClaveCatastralMessage: <span>
                        Lo invitamos a realizar su pago <a
                            href={`https://servicios.lapaz.gob.mx/predial.php?folio=${negocio?.clave_catastral}&tipo=${negocio?.tipo_predio}`}
                            target="_blank"
                        >click aquí</a>
                    </span>,
                    pagoClaveCatastral: false,
                }]
            }
        }
        return negociosValidos;
    } catch (error) {
        throw error; // Rethrow the error if needed
    }
}

export const validateClaveCatastralDeNegocios = async (negocios, token, setNegociosLista, negociosLista) => {
    let negociosValidos = negociosLista?.negociosValidos ?? [];
    try {
        const results = await Promise.all(negocios.map(negocio => performPostRequest(negocio, token, negociosValidos)));
        if (results.length > 0) {
            setNegociosLista({ ...negociosLista, negociosValidos: results.flat() })
        }
    } catch (error) {
        console.error('Error during validation:', error);
    }

}
