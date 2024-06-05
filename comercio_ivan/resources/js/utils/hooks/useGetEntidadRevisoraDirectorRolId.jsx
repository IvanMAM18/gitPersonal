import axios from "axios";
import { useState } from "react";

export default function useGetEntidadRevisoraDirectorRolId() {
    const [entidadRevisoraDirectorRolId, setEntidadRevisoraDirectorRolId] =
        useState(null);

    const getEntidadRevisoraDirectorRolId = () => {
        axios
            .get("/app/get_entidad_revisora_director_rol_id")
            .then((result) => {
                setEntidadRevisoraDirectorRolId(result?.data?.id ?? null);
            });
    };

    return [entidadRevisoraDirectorRolId, getEntidadRevisoraDirectorRolId];
}
