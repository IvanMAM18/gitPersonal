import axios from "axios";
import { useState } from "react";

export default function useFirmarResolutivo() {
    const [resolutivoFirmado, setResolutivoFirmado] = useState(null);

    const firmarResolutivo = (entidad_revisora_id, negocio_id, year) => {
        axios
            .post(`/app/firmar_resolutivo`, {
                er_id: entidad_revisora_id,
                negocio_id: negocio_id,
                year: year,
            })
            .then((result) => setResolutivoFirmado(result?.data ?? null));
    };

    return [resolutivoFirmado, firmarResolutivo];
}
