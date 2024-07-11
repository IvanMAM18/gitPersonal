export const tramitesFormFields = [
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
        name: "nombre",
        label: "Nombre",
        value: "",
        type: "input",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido",
            },
        ],
    },
    {
        name: "descripcion",
        label: "Descripción",
        value: "",
        type: "input",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido",
            },
        ],
    },
    {
        name: "link",
        label: "Enlace",
        value: "",
        type: "input",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido!",
            },
        ],
    },
    {
        name: "pago",
        label: "Tiene pagos?",
        value: false,
        type: "checkbox",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido!",
            },
        ],
    },
    {
        name: "resolutivo",
        label: "Genera resolutivos?",
        value: false,
        type: "checkbox",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido!",
            },
        ],
    },
    {
        name: "tipo",
        label: "Tipo de acceso",
        value: "",
        type: "select",
        disabled: false,
        options: [
            { id: "publico", nombre: "Público" },
            { id: "interno", nombre: "Interno" },
        ],
        rules: [
            {
                required: true,
                message: "Campo requerido!",
            },
        ],
    },
    {
        name: "en_linea",
        label: "Tramite disponible en línea",
        value: false,
        type: "checkbox",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido!",
            },
        ],
    },
];
export const girosFormFields = [
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
        name: "nombre",
        label: "Nombre",
        value: "",
        type: "input",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Este campo es requerido!",
            },
        ],
    },
    {
        name: "descripcion",
        label: "Descripción",
        value: "",
        type: "input",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Este campo es requerido!",
            },
        ],
    },
    {
        name: "clave_scian",
        label: "SCIAN",
        value: "",
        type: "numeric",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Este campo es requerido!",
            },
        ],
    },
    {
        name: "tipo",
        label: "Tipo",
        value: "",
        type: "select",
        disabled: false,
        options: [
            { id: "bajo_impacto", name: "Bajo Impacto" },
            { id: "mediano_alto_impacto", name: "Mediano/Alto Impacto" },
        ],
        rules: [
            {
                required: true,
                message: "Este campo es requerido!",
            },
        ],
    },
    {
        name: "tipo_sector",
        label: "Sector",
        value: "",
        type: "select",
        disabled: false,
        options: [
            { id: "SERVICIOS", name: "SERVICIOS" },
            { id: "INDUSTRIA", name: "INDUSTRIA" },
            { id: "COMERCIO", name: "COMERCIO" },
        ],
        rules: [
            {
                required: true,
                message: "Este campo es requerido!",
            },
        ],
    },
    {
        name: "cobro_programa_interno",
        label: "Cobro Programa Interno",
        value: false,
        type: "checkbox",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido!",
            },
        ],
    },
    {
        name: "certificado_medio_ambiente",
        label: "Certificado Medio Ambiente",
        value: false,
        type: "checkbox",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido!",
            },
        ],
    },
    {
        name: "licencia_alcohol",
        label: "Licencia de Alcohol",
        value: false,
        type: "checkbox",
        disabled: false,
        rules: [
            {
                required: true,
                message: "Campo requerido!",
            },
        ],
    },
];
