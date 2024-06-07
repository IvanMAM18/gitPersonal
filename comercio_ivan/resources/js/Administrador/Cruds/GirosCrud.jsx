import React, { useEffect } from "react";
import CrudView from "./CrudView";
import { girosColumns } from "./columnsArrays";
import { girosFormFields } from "./formFieldsArrays";
import useGetServiciosPublicos from "../../utils/hooks/useGetServiciosPublicos";

export default function GirosCrud() {
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
                <CrudView
                    pageTitle="Catálogo dee Giros comerciales"
                    modelo="giros"
                    columns={girosColumns}
                    formFields={[...girosFormFields, serviciosPublicosFormItem]}
                    key="giro"
                />
            )}
        </>
    );
}
