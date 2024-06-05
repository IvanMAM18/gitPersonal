import axios from "axios";
import { useState } from "react";

export default function useCheckAndGetResolutivoPorNegocioERAndObs() {
    const [resolutivoGuardado, setResolutivosGuardado] = useState(null);

    const checkAndGetResolutivoPorNegocioERAndObs = (
        entidad_revisora_id,
        tramite_id,
        observaciones,
        year
    ) => {
        axios
            .get(
                `/app/get_check_resolutivos_por_negocio_entidad_revisora_id_obs/?er_id=${entidad_revisora_id}&tramite_id=${tramite_id}&observaciones=${observaciones}&year=${year}`
            )
            .then((result) => {
                setResolutivosGuardado(result?.data ?? null);
            });
    };

    return [resolutivoGuardado, checkAndGetResolutivoPorNegocioERAndObs];
}
