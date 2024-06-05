import axios from "axios";
import { useState } from "react";

export default function useGetInformacionDelPredio() {
    const [informacionDelPredio, setInformacionDelPredio] = useState(null);

    const getInformacionDelPredio = async (tipo, clave_catastral) => {
        const loginInfoResponse = await axios
            .get("/app/get_comercio_token")
            .catch((error) => {
                console.log(error);
            });
        const predioInfoResponse = await axios
            .post("/app/get_info_123_", {
                comercio_token: loginInfoResponse?.data?.token,
                clave_folio: clave_catastral ?? "",
                tipo_predial: tipo ?? "U",
            })
            .catch((error) => console.log("predioInfoResponse: ", error));
        setInformacionDelPredio(predioInfoResponse?.data ?? null);
    };

    return [informacionDelPredio, getInformacionDelPredio];
}
