import axios from "axios";
import { useState } from "react";

export default function useGetNegocios() {
    const [negocios, setNegocios] = useState(null);

    const getNegocios = async (tipoNegocios) => {
        const url = { url: "" };
        switch (tipoNegocios) {
            case "admin":
                url.url = "/app/negocios_admin_all";
                break;
            case "user":
                url.url = "/app/negocios_usuario_all";
                break;
            default:
                setNegocios(null);
                break;
        }

        await axios.get(url.url).then((result) => {
            setNegocios(result.data);
        });
    };

    return [negocios, getNegocios];
}
