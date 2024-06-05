import axios from "axios";
import { useState } from "react";

export default function useGetResolutivosPorEntidadRevisora() {
    const [resolutivosGuardados, setResolutivosGuardados] = useState(null);

    const getResolutivosPorEntidadRevisora = (entidad_revisora_id) => {
        axios
            .get(
                `/app/get_resolutivos_por_entidad_revisora_id/${entidad_revisora_id}`
            )
            .then((result) => {
                setResolutivosGuardados(result?.data ?? null);
            });
    };

    return [resolutivosGuardados, getResolutivosPorEntidadRevisora];
}
