export const getNegocioColumns = (personaMoralButton) => {
    return [
        {
            title: "Nombre",
            dataIndex: "nombre_del_negocio",
            key: "nombre_del_negocio",
            render: (text, record) => {
                return <strong>{record.nombre_del_negocio}</strong>;
            },
        },
        {
            title: "Actividad",
            dataIndex: "descripcion_actividad",
            key: "descripcion_actividad",
        },
        {
            title: "Propietario (persona física)",
            dataIndex: "persona",
            key: "persona",
            render: (text, record) =>
                `${record?.persona?.nombre ?? ""} ${
                    record?.persona?.apellido_pat ?? ""
                } ${record?.persona?.apellido_mot ?? ""}`,
        },

        {
            title: "Persona moral",
            dataIndex: "persona",
            key: "persona",
            render: (text, record) => {
                return (
                    <div>
                        <span style={{ marginRight: 10 }}>
                            {record?.persona_moral !== null &&
                            record?.persona_moral !== undefined
                                ? record?.persona_moral?.razon_social
                                : "NA"}
                        </span>

                        {personaMoralButton(record)}
                    </div>
                );
            },
        },
    ];
};
export const getPersonaMoralColumns = (
    personaMoralButton,
    regimenFiscalList,
    regimenCapitalList
) => [
    {
        title: "Razón social",
        dataIndex: "razon_social",
        key: "razon_social",
        render: (text, record) => {
            return record.razon_social;
        },
    },
    {
        title: "Régimen fiscal",
        dataIndex: "regimen_fiscal",
        key: "regimen_fiscal",
        render: (text, record) => {
            return regimenFiscalList.find(
                (regimenFiscal) => regimenFiscal?.id === record?.regimen_fiscal
            )?.name;
        },
    },
    {
        title: "Régimen capital",
        dataIndex: "regimen_capital",
        key: "regimen_capital",
        render: (text, record) => {
            return regimenCapitalList.find(
                (regimenCapital) =>
                    regimenCapital?.id === record?.regimen_capital
            )?.name;
        },
    },
    {
        title: "Acciones",
        dataIndex: "persona",
        key: "persona",
        render: (text, record) => {
            return personaMoralButton(record);
        },
    },
];

// const FormFields = [
//     {
//         name: "id",
//         label: "ID",
//         value: "",
//         type: "input",
//         disabled: true,
//         hidden: true,
//         rules: [
//             {
//                 required: false,
//                 message: "",
//             },
//         ],
//     },
//     {
//         name: "razon_social",
//         label: "Razón social",
//         value: "",
//         type: "input",
//         disabled: false,
//         rules: [
//             {
//                 required: true,
//                 message: "Este campo es requerido!",
//             },
//         ],
//     },
//     {
//         name: "regimen_fiscal",
//         label: "Regimen fiscal",
//         value: "",
//         type: "select",
//         disabled: false,
//         options: [...regimenFiscalList],
//         rules: [
//             {
//                 required: true,
//                 message: "Este campo es requerido!",
//             },
//         ],
//     },
//     {
//         name: "regimen_capital",
//         label: "Regimen capital",
//         value: "",
//         type: "select",
//         disabled: false,
//         options: [...regimenCapitalList],
//         rules: [
//             {
//                 required: true,
//                 message: "Este campo es requerido!",
//             },
//         ],
//     },
// ];
