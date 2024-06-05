import axios from "axios";
import { useState } from "react";

export default function useGetDireccionDeNotificacion() {
    const [direccionDeNotificacion, setDireccionDeNotificacion] =
        useState(null);

    const getDireccionDeNotificacion = (negocio_id) => {
        axios
            .get(`/app/get_direccion_notificacion_del_negocio/${negocio_id}`)
            .then((result) => {
                const direccion = getDireccionString(result?.data);
                setDireccionDeNotificacion(direccion ?? "NA");
            });
    };

    return [direccionDeNotificacion, getDireccionDeNotificacion];
}
const getDireccionString = (direccion) => {
    return `${direccion?.calle_principal ?? ""} No.Ext.${direccion?.numero_externo ?? " NA"
        } No.Int.${direccion?.numero_interno || " NA"} ${direccion?.calles ? "e/ " + direccion?.calles : ""
        } C.P. ${direccion?.codigo_postal || " NA"}${direccion?.colonia
            ? ` Col. ${direccion?.colonia?.nombre_localidad || "NA"}`
            : ""
        }`;
};