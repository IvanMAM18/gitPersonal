
import React, { useEffect } from "react";
import ListaDeGirosComerciales from "@/v2/views/ListaDeGirosComerciales/Index";
import { girosColumns } from "@/Administrador/Cruds/columnsArrays";
import { girosFormFields } from "@/Administrador/Cruds/formFieldsArrays";
import useGetServiciosPublicos from "@/utils/hooks/useGetServiciosPublicos";

export default function GirosComercialesLayout() {

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
                <div className="p-5">
                    <ListaDeGirosComerciales
                        pageTitle="Catálogo de Giros comerciales"
                        modelo="giros"
                        columns={girosColumns}
                        formFields={[...girosFormFields, serviciosPublicosFormItem]}
                        key="giro"
                    />
                </div>
            )}
        </>
    );
}
