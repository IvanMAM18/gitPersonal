import axios from "axios";
import { useState } from "react";

export default function useGetCodigosPostales() {
    const [codigosPostales, setCodigosPostales] = useState([]);

    const getCodigosPostales = () => {
        axios.get("/app/get_codigos_postales").then((result) => {
            result?.data.map((codigo_postal) => {
                (codigo_postal.name = codigo_postal.codigo_postal),
                    (codigo_postal.id = codigo_postal.codigo_postal);
            });
            setCodigosPostales(result.data);
        });
    };

    return [codigosPostales, getCodigosPostales];
}
