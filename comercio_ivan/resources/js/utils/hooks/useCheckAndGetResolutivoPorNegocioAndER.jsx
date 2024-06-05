import axios from "axios";
import { useState } from "react";

export default function useCheckAndGetResolutivoPorNegocioAndER() {
    const [resolutivosGuardado, setResolutivosGuardado] = useState(null);

    const checkAndGetResolutivoPorNegocioAndER = (
        entidad_revisora_id,
        negocio_id,
        year
    ) => {
        axios
            .get(
                `/app/get_check_resolutivos_por_negocio_entidad_revisora_id/?er_id=${entidad_revisora_id}&negocio_id=${negocio_id}&year=${year}`
            )
            .then((result) => {
                setResolutivosGuardado(result?.data ?? null);
            });
    };

    return [resolutivosGuardado, checkAndGetResolutivoPorNegocioAndER];
}
