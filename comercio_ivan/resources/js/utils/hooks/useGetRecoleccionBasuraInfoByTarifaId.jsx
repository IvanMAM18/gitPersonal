import axios from "axios";
import { useState } from "react";

export default function useGetRecoleccionBasuraInfoByTarifaId() {
    const [recoleccionBasuraInfo, setRecoleccionBasuraInfo] = useState(null);

    const getRecoleccionBasuraInfoByTarifaId = (tarifa_recoleccion_id) => {
        axios
            .get(
                `/app/get_tarifa_recoleccion_basura_info_by_id/${tarifa_recoleccion_id}`
            )
            .then((result) => {
                setRecoleccionBasuraInfo(result?.data ?? null);
            });
    };

    return [recoleccionBasuraInfo, getRecoleccionBasuraInfoByTarifaId];
}
