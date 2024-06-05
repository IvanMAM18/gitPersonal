import axios from "axios";
import { useEffect, useState } from "react";

export default function useNegocioDetallesEntidadRevisora (entidad_revisora_id, selectedYear) {
    const [negocio, setNegocioDetalles] = useState({})

    const updateNegocio = (negocioId, entidad_revisora_id, selectedYear) => {
        axios.get(`/app/negocio-entidad-revisora/${negocioId}/${entidad_revisora_id}/${selectedYear}`)
            .then(result => {
                let data = result.data
                console.log("Negocios Entidad Revisora: ", entidad_revisora_id)
                setNegocioDetalles(data)
            })
    }

    return [negocio, updateNegocio]
}
