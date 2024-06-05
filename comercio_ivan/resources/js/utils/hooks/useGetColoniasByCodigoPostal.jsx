import axios from "axios";
import { useState } from "react";

export default function useGetColoniasByCodigoPostal() {
    const [colonias, setColonias] = useState([]);

    const getColoniasByCodigoPostal = (codigo_postal) => {
        axios
            .get(`/app/get_colonias_by_codigo_postal/${codigo_postal}`)
            .then((result) => {
                setColonias(result?.data ?? []);
            });
    };

    return [colonias, getColoniasByCodigoPostal];
}
