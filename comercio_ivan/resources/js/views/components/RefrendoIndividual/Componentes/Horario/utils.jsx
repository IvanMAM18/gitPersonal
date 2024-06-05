import moment from "moment";
const dias = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
];

export const validateSchedule = (schedule, setErrorEnHorario) => {
    let error = { error: false, reason: "" };
    Object.keys(schedule).forEach((key) => {
        if (schedule[key].toLowerCase() === "invalid date") {
            error.error = true;
            error.reason = "Fecha invalida";
        }
    });
    if (error.error === true) {
        setErrorEnHorario(error);
        return;
    }
    if (Object.keys(schedule).length % 2 === 1) {
        error.error = true;
        error.reason = "Horario incompleto";
    }
    setErrorEnHorario(error);
};

export const scheduleObj = {
    lunesObj: null,
    martesObj: null,
    miercolesObj: null,
    juevesObj: null,
    viernesObj: null,
    sabadoObj: null,
    domingoObj: null,
    lunesObjc: null,
    martesObjc: null,
    miercolesObjc: null,
    juevesObjc: null,
    viernesObjc: null,
    sabadoObjc: null,
    domingoObjc: null,
    lunesDisabled: true,
    martesDisabled: true,
    miercolesDisabled: true,
    juevesDisabled: true,
    viernesDisabled: true,
    sabadoDisabled: true,
    domingoDisabled: true,
};

export const getCurrentSchedule = (schedule) => {
    const scheduleToReturn = {};
    const date = "2017-03-13";
    Object.keys(schedule).forEach((key) => {
        if (key === "lunes") {
            scheduleToReturn["lunesObj"] = moment(date + " " + schedule[key]);
            scheduleToReturn["lunesDisabled"] = false;
        }
        if (key === "lunesc") {
            scheduleToReturn["lunesObjc"] = moment(date + " " + schedule[key]);
            scheduleToReturn["lunesDisabled"] = false;
        }
        if (key === "martes") {
            scheduleToReturn["martesObj"] = moment(date + " " + schedule[key]);
            scheduleToReturn["martesDisabled"] = false;
        }
        if (key === "martesc") {
            scheduleToReturn["martesObjc"] = moment(date + " " + schedule[key]);
            scheduleToReturn["martesDisabled"] = false;
        }
        if (key === "miercoles") {
            scheduleToReturn["miercolesObj"] = moment(
                date + " " + schedule[key]
            );
            scheduleToReturn["miercolesDisabled"] = false;
        }
        if (key === "miercolesc") {
            scheduleToReturn["miercolesObjc"] = moment(
                date + " " + schedule[key]
            );
            scheduleToReturn["miercolesDisabled"] = false;
        }
        if (key === "jueves") {
            scheduleToReturn["juevesObj"] = moment(date + " " + schedule[key]);
            scheduleToReturn["juevesDisabled"] = false;
        }
        if (key === "juevesc") {
            scheduleToReturn["juevesObjc"] = moment(date + " " + schedule[key]);
            scheduleToReturn["juevesDisabled"] = false;
        }
        if (key === "viernes") {
            scheduleToReturn["viernesObj"] = moment(date + " " + schedule[key]);
            scheduleToReturn["viernesDisabled"] = false;
        }
        if (key === "viernesc") {
            scheduleToReturn["viernesObjc"] = moment(
                date + " " + schedule[key]
            );
            scheduleToReturn["viernesDisabled"] = false;
        }
        if (key === "sabado") {
            scheduleToReturn["sabadoObj"] = moment(date + " " + schedule[key]);
            scheduleToReturn["sabadoDisabled"] = false;
        }
        if (key === "sabadoc") {
            scheduleToReturn["sabadoObjc"] = moment(date + " " + schedule[key]);
            scheduleToReturn["sabadoDisabled"] = false;
        }
        if (key === "domingo") {
            scheduleToReturn["domingoObj"] = moment(date + " " + schedule[key]);
            scheduleToReturn["domingoDisabled"] = false;
        }
        if (key === "domingoc") {
            scheduleToReturn["domingoObjc"] = moment(
                date + " " + schedule[key]
            );
            scheduleToReturn["domingoDisabled"] = false;
        }
    });

    return Object.keys(scheduleToReturn).length > 0 ? scheduleToReturn : null;
};

export const setClosed = (schedule) => { };

export const getCleanSchedule = (_schedule) => {
    const cleanSchedule = {
        lunes: _schedule?.lunesObj?.format("HH:mm"),
        martes: _schedule?.martesObj?.format("HH:mm"),
        miercoles: _schedule?.miercolesObj?.format("HH:mm"),
        jueves: _schedule?.juevesObj?.format("HH:mm"),
        viernes: _schedule?.viernesObj?.format("HH:mm"),
        sabado: _schedule?.sabadoObj?.format("HH:mm"),
        domingo: _schedule?.domingoObj?.format("HH:mm"),
        lunesc: _schedule?.lunesObjc?.format("HH:mm"),
        martesc: _schedule?.martesObjc?.format("HH:mm"),
        miercolesc: _schedule?.miercolesObjc?.format("HH:mm"),
        juevesc: _schedule?.juevesObjc?.format("HH:mm"),
        viernesc: _schedule?.viernesObjc?.format("HH:mm"),
        sabadoc: _schedule?.sabadoObjc?.format("HH:mm"),
        domingoc: _schedule?.domingoObjc?.format("HH:mm"),
    };
    return cleanSchedule;
};
