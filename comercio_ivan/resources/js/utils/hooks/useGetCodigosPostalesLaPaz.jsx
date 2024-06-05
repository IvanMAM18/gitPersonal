import axios from "axios";
import { useState } from "react";

export default function useGetCodigosPostalesLaPaz() {
    const [codigosPostalesLaPaz, setCodigosPostalesLaPaz] = useState([]);

    const getCodigosPostalesLaPaz = () => {
        axios.get("/app/get_codigos_postales_from_bcs").then((result) => {
            result?.data.map((codigo_postal) => {
                (codigo_postal.name = codigo_postal.codigo_postal),
                    (codigo_postal.id = codigo_postal.codigo_postal);
            });
            setCodigosPostalesLaPaz(result.data);
        });
    };

    return [codigosPostalesLaPaz, getCodigosPostalesLaPaz];
}
