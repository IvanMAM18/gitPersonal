import axios from "axios";
import { useState } from "react";

export default function useValidarRFC() {
    const [esRFCVAlido, setEsRFCVAlido] = useState(null);

    const validarRFC = async (rfc) => {
        const predioInfoResponse = await axios.get(`/app/validar_rfc?rfc=${rfc}`)
            .catch((error) => console.log(error));
        setEsRFCVAlido(predioInfoResponse?.data);
    }
    return [esRFCVAlido, validarRFC];
}
