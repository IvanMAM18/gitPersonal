import axios from "axios";
import { useState } from "react";

export default function useGetDetallesNegocioPorId() {
    const [negocio, setDetallesNegocio] = useState(null);

    const getNegocio = (negocioId, isAlcoholes, year) => {
        const url = isAlcoholes  ? "detalles_negocio_para_resolutivos_por_id_alcoholes" : "detalles_negocio_para_resolutivos_por_id";
        axios.get(`/app/${url}/${negocioId}/${year}`).then((result) => {
            setDetallesNegocio(result?.data ?? null);
        });
    };

    return [negocio, getNegocio];
}
