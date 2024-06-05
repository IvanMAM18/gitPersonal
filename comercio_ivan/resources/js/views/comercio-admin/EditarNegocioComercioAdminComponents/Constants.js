const sectoresConPeso = {
    SERVICIOS: 1,
    COMERCIO: 2,
    INDUSTRIA: 3
}
// [
//     {
//         sector: "INDUSTRIA",
//         peso: 3
//     },
//     {
//         sector: "COMERCIO",
//         peso: 2
//     },
//     {
//         sector: "SERVICIOS",
//         peso: 1
//     },
// ];
const girosAlcoholes = [
    {
        id: 1020,
        nombre: "Bares, cantinas y similares",
        tipo_sector: "SERVICIOS"
    },
    {
        id: 1019,
        nombre: "Centros nocturnos, discotecas y similares",
        tipo_sector: "SERVICIOS"
    },
    {
        id: 1011,
        nombre: "Hoteles con casino",
        tipo_sector: "SERVICIOS"
    },
    {
        id: 993,
        nombre: "Casinos",
        tipo_sector: "SERVICIOS"
    },
    {
        id: 559,
        nombre: "Comercio al por menor de cerveza",
        tipo_sector: "COMERCIO"
    },
    {
        id: 558,
        nombre: "Comercio al por menor de vinos y licores",
        tipo_sector: "COMERCIO"
    },
    // {
    //     id: 548,
    //     nombre: "Comercio al por menor en tiendas de abarrotes, ultramarinos y misceláneas",
    //     tipo_sector: "COMERCIO"
    // },
    {
        id: 494,
        nombre: "Comercio al por mayor de cerveza",
        tipo_sector: "COMERCIO"
    },
    {
        id: 493,
        nombre: "Comercio al por mayor de vinos y licores",
        tipo_sector: "COMERCIO"
    },
    {
        id: 477,
        nombre: "Comercio al por mayor de abarrotes",
        tipo_sector: "COMERCIO"
    },
    {
        id: 236,
        nombre: "Elaboración de bebidas destiladas de agave",
        tipo_sector: "INDUSTRIA"
    },
    {
        id: 235,
        nombre: "Elaboración de ron y otras bebidas destiladas de caña",
        tipo_sector: "INDUSTRIA"
    },
    {
        id: 234,
        nombre: "Elaboración de sidra y otras bebidas fermentadas",
        tipo_sector: "INDUSTRIA"
    },
    {
        id: 233,
        nombre: "Elaboración de pulque",
        tipo_sector: "INDUSTRIA"
    },
    {
        id: 232,
        nombre: "Elaboración de bebidas alcohólicas a base de uva",
        tipo_sector: "INDUSTRIA"
    },
    {
        id: 231,
        nombre: "Elaboración de cerveza",
        tipo_sector: "INDUSTRIA"
    }
];

const tiposEmpresa = [
    {
        tipo: "Contribuyente Actualizará por Su Cuenta",
        value: null,
    },
    {
        tipo: "AUTOEMPLEO (SIN EMPLEADOS)",
        value: "autompleo",
    },
    {
        tipo: "MICRO (1-10 EMPLEADOS)",
        value: "micro",
    },
    {
        tipo: "PEQUEÑA (11-30 EMPLEADOS)",
        value: "pequeña",
    },
    {
        tipo: "MEDIANA (31-100 EMPLEADOS)",
        value: "mediana",
    },
    {
        tipo: "GRANDE (101 EMPLEADOS EN ADELANTE)",
        value: "grande",
    },
];
const email_regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export {
    email_regex,
    tiposEmpresa,
    girosAlcoholes,
    sectoresConPeso,
}