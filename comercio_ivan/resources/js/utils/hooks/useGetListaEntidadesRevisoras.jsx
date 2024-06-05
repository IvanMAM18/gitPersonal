import axios from "axios";
import { useState } from "react";

export default function useGetListaEntidadesRevisoras() {
    const [entidadesRevisoras, setEntidadesRevisoras] = useState([]);

    const getEntidadesRevisoras = () => {
        axios
            .get("/app/dashadmin_get_todas_las_entidades_revisoras")
            .then((result) => {
                result?.data?.map((entidadRevisora) => {
                    entidadRevisora.name = entidadRevisora.nombre;
                });
                setEntidadesRevisoras(result?.data ?? []);
            });
    };

    return [entidadesRevisoras, getEntidadesRevisoras];
}
