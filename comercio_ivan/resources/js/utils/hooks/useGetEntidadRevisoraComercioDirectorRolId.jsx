import axios from "axios";
import { useState } from "react";

export default function useGetEntidadRevisoraComercioDirectorRolId() {
    const [entidadRevisoraComercioRolId, setEntidadRevisoraComercioRolId] = useState(null);

    const getEntidadRevisoraComercioRolId = () => {
        axios
            .get("/app/get_entidad_revisora_comercio_admin_director_rol_id")
            .then((result) => {
                setEntidadRevisoraComercioRolId(result?.data?.id ?? null);
            });
    };

    return [entidadRevisoraComercioRolId, getEntidadRevisoraComercioRolId];
}
