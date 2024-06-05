import { message } from "antd";
import axios from "axios";
import { useState } from "react";
export default function useSaveAndSignResolutivo() {
    const [resolutivoFirmado, setResolutivoFirmado] = useState(null);

    const saveAndSignResolutivo = async (
        data,
        url = "/app/save_resolutivo_licencia_funcionamiento",
        puedeFirmar,
        year,
        setLoading,
    ) => {
        console.log({ data }, { url }, { puedeFirmar }, { year });
        const resolutivo = await axios
            .post(url, data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .catch((error) =>
                message.error("Ha habido un problema guardadndo el resolutivo")
            );
        if (resolutivo?.data) {
            message.success("Se ha guardado con éxito el resolutivo");
        }
        if (
            resolutivo?.data?.folio !== null &&
            resolutivo?.data?.folio !== undefined &&
            resolutivo?.data?.folio !== ""
        ) {
            setResolutivoFirmado(resolutivo?.data ?? null);
            setLoading?.(false);
            return;
        }
        if (puedeFirmar) {
            const responseResolutivoFirmado = await axios
                .post(`/app/firmar_resolutivo_por_id`, {
                    resolutivo_id: resolutivo?.data?.id ?? -1,
                    tramite_id: resolutivo?.data?.tramite_id,
                    year: year,
                })
                .catch((error) => console.log(error));
            setResolutivoFirmado(responseResolutivoFirmado?.data ?? null);
        }
        setLoading?.(false);
    };

    return [resolutivoFirmado, saveAndSignResolutivo];
}
