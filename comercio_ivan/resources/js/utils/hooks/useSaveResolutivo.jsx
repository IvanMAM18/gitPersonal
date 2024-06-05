import axios from "axios";
import { useState } from "react";
export default function useSaveResolutivo() {
    const [resolutivo, setResolutivo] = useState(null);

    const saveResolutivo = (data) => {
        axios
            .post("/app/save_resolutivo_info", data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((result) => {
                setResolutivo(result?.data ?? null);
            });
    };

    return [resolutivo, saveResolutivo];
}
