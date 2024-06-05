import axios from "axios";
import { useState } from "react";

export default function useGetColonibyId() {
    const [colonia, setColonia] = useState(null);

    const getColonia = (colonia_id) => {
        axios
            .get(`/app/get_colonia_from_codigos_postales_by_id/${colonia_id}`)
            .then((result) => {
                setColonia(result?.data ?? null);
            });
    };

    return [colonia, getColonia];
}
