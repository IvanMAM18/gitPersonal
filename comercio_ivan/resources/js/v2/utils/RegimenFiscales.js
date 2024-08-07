const regimenFiscales = [
    {
        id: "601",
        name: "General de Ley Personas Morales",
        persona_fisica: false,
        persona_moral: true,
    },
    {
        id: "603",
        name: "Personas Morales con Fines no Lucrativos",
        persona_fisica: false,
        persona_moral: true,
    },
    {
        id: "605",
        name: "Sueldos y Salarios e Ingresos Asimilados a Salarios",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "606",
        name: "Arrendamiento",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "607",
        name: "Régimen de Enajenación o Adquisición de Bienes",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "608",
        name: "Demás ingresos",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "610",
        name: "Residentes en el Extranjero sin Establecimiento Permanente en México",
        persona_fisica: true,
        persona_moral: true,
    },
    {
        id: "611",
        name: "Ingresos por Dividendos (socios y accionistas)",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "612",
        name: "Personas Físicas con Actividades Empresariales y Profesionales",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "614",
        name: "Ingresos por intereses",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "615",
        name: "Régimen de los ingresos por obtención de premios",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "616",
        name: "Sin obligaciones fiscales",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "620",
        name: "Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
        persona_fisica: false,
        persona_moral: true,
    },
    {
        id: "621",
        name: "Incorporación Fiscal",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "622",
        name: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
        persona_fisica: false,
        persona_moral: true,
    },
    {
        id: "623",
        name: "Opcional para Grupos de Sociedades",
        persona_fisica: false,
        persona_moral: true,
    },
    {
        id: "624",
        name: "Coordinados",
        persona_fisica: false,
        persona_moral: true,
    },
    {
        id: "625",
        name: "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
        persona_fisica: true,
        persona_moral: false,
    },
    {
        id: "626",
        name: "Régimen Simplificado de Confianza",
        persona_fisica: true,
        persona_moral: true,
    },
];

const regimenFiscalesPersonasFisicas = regimenFiscales
    .filter(r => r.persona_fisica == true)

const regimenFiscalesPersonasMorales = regimenFiscales
    .filter(r => r.persona_moral == true)

export { regimenFiscales, regimenFiscalesPersonasFisicas, regimenFiscalesPersonasMorales  }
