import { message } from "antd";
import axios from "axios";
import { useState } from "react";

export default function useGetResolutivoPorFolio() {
    const [resolutivo, setResolutivo] = useState(null);

    const getResolutivo = async (folio) => {
        const resolutivo = await axios
            .get(`/get_resolutivo_por_folio/${folio}`)
            .catch((error) =>
                message.error(
                    "Hubo un error al obtener la información del resolutivo"
                )
            );
        setResolutivo(resolutivo?.data ?? null);
    };

    return [resolutivo, getResolutivo];
}
