
import React, { useEffect } from "react";
import CrudGirosPublic from "./CrudGirosPublic";
import { girosColumns } from "../Administrador/Cruds/columnsArrays";
import { girosFormFields } from "../Administrador/Cruds/formFieldsArrays";
import useGetServiciosPublicos from "../utils/hooks/useGetServiciosPublicos";

export default function TablaLayoutPublic() {
    const [serviciosPublicos, getServiciosPublicos] = useGetServiciosPublicos();
    useEffect(() => getServiciosPublicos(), []);
    const serviciosPublicosFormItem = {
        name: "servicio_publico_id",
        label: "Servicio público",
        value: "",
        type: "select",
        disabled: false,
        options: serviciosPublicos ?? [],
        rules: [
            {
                required: true,
                message: "Este campo es requerido!",
            },
        ],
    };
    return (
        <>
            {serviciosPublicos && (
                <CrudGirosPublic
                    pageTitle="Catálogo de Giros comerciales"
                    modelo="giros"
                    columns={girosColumns}
                    formFields={[...girosFormFields, serviciosPublicosFormItem]}
                    key="giro"
                />
            )}
        </>
    );
}