export const impactos =
{
    bajo_impacto: "Bajo",
    mediano_alto_impacto: "Mediano/Alto",
}
export const getImpactoFromGiros = (girosComerciales) => {
    const girosMedianoAlto = girosComerciales?.filter(giro => giro?.tipo == 'mediano_alto_impacto') ?? [];
    return girosMedianoAlto.length > 0 ? girosMedianoAlto?.[0]?.tipo : "bajo_impacto";
}
