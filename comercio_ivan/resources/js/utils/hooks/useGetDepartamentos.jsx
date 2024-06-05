import axios from "axios";
import { useState } from "react";

export default function useGetDepartamentos() {
    const [Departamentos, setDepartamentos] = useState([]);

    const getDepartamentos = () => {
        axios
            .get(
                "https://lapaz.gob.mx/api/dashadmin_departamentos_with_entidades_revisoras_all_api"
            )
            .then((result) => {
                const data = result?.data?.map((dato) => ({
                    ...dato,
                    children: dato.entidades_revisoras.map((er) => ({
                        ...er,
                        value: er.id,
                        label: er.nombre,
                    })),
                    value: dato.id,
                    label: dato.name,
                }));
                setDepartamentos(data ?? []);
            });
    };

    return [Departamentos, getDepartamentos];
}
