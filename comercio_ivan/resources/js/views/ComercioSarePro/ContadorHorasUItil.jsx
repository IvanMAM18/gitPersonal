const diasFestivos = [
    // Lista de días festivos en México (formato: mes, día)
    [1, 1],   // Año Nuevo
    [5, 1],   // Día del Trabajo
    [9, 16],  // Día de la Independencia
    [11, 20], // Revolución Mexicana
    // Agrega más días festivos según sea necesario
];
// Definir la hora de inicio y fin del día laboral en México (8 am a 2 pm)
const startHour = 8;
const endHour = 14;

// Función para verificar si un día es hábil (lunes a viernes)
function esDiaHabil(date) {
    const dia = date.getDay();
    return dia >= 1 && dia <= 5; // Retorna true si es de lunes a viernes
}
// Función para verificar si una fecha es un día festivo en México
function esDiaFestivo(date) {
    const mes = date.getMonth() + 1;
    const dia = date.getDate();

    for (const festivo of diasFestivos) {
        if (festivo[0] === mes && festivo[1] === dia) {
            return true; // Es un día festivo
        }
    }

    return false; // No es un día festivo
}

// Función para contar las horas hábiles excluyendo días festivos
export function contarHorasHabilesSinFestivos(startString, endString) {
    const start = new Date(startString);
    const end = new Date(endString);
    let contadorHoras = 0;

    while (start < end) {
        // Verificar si la fecha actual es un día hábil, no es festivo y está dentro del rango horario
        if (esDiaHabil(start) && !esDiaFestivo(start) && start.getHours() >= startHour && start.getHours() < endHour) {
            contadorHoras += 1;
        }

        // Avanzar al siguiente minuto
        start.setMinutes(start.getMinutes() + 1);
    }

    return (contadorHoras / 60).toFixed(2);
}

// // Calcular las horas hábiles excluyendo días festivos entre las fechas
// const horasHabilesSinFestivos = contarHorasHabilesSinFestivos(startDate, endDate);

// console.log(`Horas hábiles (sin festivos) contadas: ${horasHabilesSinFestivos} horas.`);