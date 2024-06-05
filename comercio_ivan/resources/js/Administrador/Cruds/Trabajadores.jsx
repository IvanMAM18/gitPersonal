import { useEffect, useState } from "react";
import useGetRoles from "../../utils/hooks/useGetRoles";
import useGetDepartamentos from "../../utils/hooks/useGetDepartamentos";
import CrudView from "./CrudView";

export default function Trabajadores() {
    const [roles, getRoles] = useGetRoles();
    const [departamentos, getDepartamentos] = useGetDepartamentos();

    const [renderCrudView, setRenderCrudView] = useState(false);
    useEffect(() => {
        getRoles();
        getDepartamentos();
    }, []);

    useEffect(() => {
        console.log({ roles }, { departamentos });
        if ((roles ?? false) && (departamentos ?? false)) {
            setRenderCrudView(true);
        }
    }, [roles, departamentos]);

    const sTrabajadoresColumns = [
        {
            title: "Persona",
            key: "persona_id",
            render: (record) => (
                <span>{record?.persona?.name ?? "Persona"}</span>
            ),
        },
        {
            title: "Rol",
            key: "rol_id",
            render: (record) => (
                <span>{record?.rol?.name ?? "Sin rol asignado"}</span>
            ),
            // filters: optionsRolsFilter,
            // onFilter: (value, record) => {
            //     return record.rol.name.indexOf(value) === 0;
            // },
        },
        {
            title: "Departamento",
            key: "department_id",
            render: (record) => (
                <span>{record?.departamento?.name ?? "No asignado"}</span>
            ),
            // filters: optionsDepartamentosFilter,
            // onFilter: (value, record) => {
            //     if (
            //         record.departamento !== null &&
            //         record.departamento !== undefined
            //     )
            //         return record.departamento.name.indexOf(value) === 0;
            //     else return false;
            // },
        },
        {
            title: "Entidad revisora",
            key: "entidad_revisora_id",
            render: (record) => (
                <span>{record?.entidad_revisora?.nombre ?? "No asignada"}</span>
            ),
        },
        {
            title: "Número trabajador",
            key: "numero_trabajador",
            render: (record) => (
                <span>{record?.numero_trabajador ?? "Número trabajador"}</span>
            ),
        },
        {
            title: "Usuario",
            key: "nombre_usuario",
            render: (record) => (
                <span>{record?.nombre_usuario ?? "Usuario"}</span>
            ),
        },
        {
            title: "Firma",
            key: "firma_path",
            render: (record) => (
                <img src={record.firma_path ?? ""} style={{ maxWidth: 70 }} />
            ),
        },
    ];

    const sTrabajadoresFormFields = [
        {
            name: "id",
            label: "ID",
            value: "",
            type: "input",
            disabled: true,
            hidden: true,
            rules: [
                {
                    required: false,
                    message: "",
                },
            ],
        },
        {
            name: "departamento_entidad_revisora",
            label: "Departamento - Entidad Revisora",
            value: "",
            type: "cascader",
            disabled: false,
            hidden: false,
            info: departamentos,
            rules: [
                {
                    type: "array",
                    required: false,
                    message: "Asigne un departamento y una entidad revisora!",
                },
            ],
        },
        {
            name: "rol_id",
            label: "Rol",
            value: "",
            options: roles,
            type: "select",
            disabled: false,
            rules: [
                {
                    required: true,
                    message:
                        "Por favor ingrese el nombre del rol que desea asignar!",
                },
            ],
        },
        {
            name: "numero_trabjador",
            label: "No. trabajador",
            value: "",
            type: "input",
            disabled: false,
            hidden: false,
            rules: [
                {
                    required: true,
                    message: "Ingrese un No. de trabjador",
                },
            ],
        },
        {
            name: "nombre_usuario",
            label: "Usuario",
            value: "",
            type: "input",
            disabled: false,
            hidden: false,
            rules: [
                {
                    required: true,
                    message: "",
                },
            ],
        },
        {
            name: "firma_path",
            label: "Firma",
            value: "",
            type: "image",
            disabled: false,
            hidden: false,
            rules: [
                {
                    required: true,
                    message: "",
                },
            ],
        },
    ];

    return (
        renderCrudView && (
            <CrudView
                pageTitle="Trabajadores"
                modelo="trabajadores"
                columns={sTrabajadoresColumns}
                formFields={sTrabajadoresFormFields}
                isExpandedRow={false}
                key="trabajadores"
            />
        )
    );
}
