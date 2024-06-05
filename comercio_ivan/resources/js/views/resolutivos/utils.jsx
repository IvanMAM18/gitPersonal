import moment from "moment";
import axios from "axios";
import { girosComercialesPI } from "./girosComercialesProgramaInterno";
const setPreviewImageFromForm = (
    imagePreviewFile = null,
    imagePreviewDOMId = "",
    placeholder = "/imagenes/placeholder.jpg"
) => {
    const previewContainer = document.querySelector(`img#${imagePreviewDOMId}`);
    const reader = new FileReader();
    reader.onloadend = function () {
        previewContainer.src = reader.result;
    };
    if (imagePreviewFile) {
        reader.readAsDataURL(imagePreviewFile);
    } else {
        previewContainer.src = placeholder;
    }
};
const clearPreviewImageFromForm = (
    imagePreviewDOMId = "",
    placeholder = "/imagenes/placeholder.jpg"
) => {
    const previewContainer = document.querySelector(`img#${imagePreviewDOMId}`);

    previewContainer.src = placeholder;
};
const getTipoPredio = (tipo) => {
    switch (tipo) {
        case "U":
            return "Urbano";
        case "S":
            return "Suburbano";
        case "R":
            return "Rustico";
        case "E":
            return "Especial";
        default:
            return "N/A";
    }
};
const getDescripcionUbicacion = (clave, ubicacion) => {
    const ubicacionDescriptions = {
        la_paz: `Localización del predio mediante la siguiente imagen del plano con clave ${clave} de la zonificación secundaria del programa de Desarrollo Urbano para el Centro de la Población de la Ciudad de La Paz 2018, publicado en el Diario Oficial Número 32 el día 18 de julio del 2018, registrado ante el Registro Público de la Propiedad y el Comercio el 27 de julio del 2018 quedando bajo registro 36, volumen 3 de Decretos.`,
        los_barriles: `Localización del predio mediante la siguiente imagen del plano con clave ${clave} de la estrategia de zonificación secundaria del programa subregional de Desarrollo Urbano Los Barriles — El Cardonal 2007, publicado en el Boletín Oficial de Gobierno del Estado Número 53 el día 25 de octubre de 2013.`,
        todos_santos: `Localización del predio mediante la siguiente imagen del plano con clave ${clave} de la estrategia de suelo y reservas territoriales del programa subregional del Desarrollo Urbano de Todos Santos — El Pescadero y Las Playitas, Municipio de La Paz, publicado en el Boletín Oficial del Gobierno del Estado Número 40 el día 10 de agosto del 2012.`,
        otros: "otros",
    };
    return ubicacionDescriptions[ubicacion];
};

const usoDeSueloFormFields = [
    "quien_solicita",
    "fecha_inicio_tramite",
    "autorizacion_uso_suelo",
    "negocio",
    "clave_catastral",
    "tipo_predio",
    "superficie",
    "direccion",
    "antecedentes",
    "clave_plano",
    "ubicacion_predio",
    "plano_macrolocalizacion",
    "desc_normatividad_lineamientos",
    "intensidad_uso_suelo",
    "compatibilidad",
    "descripcion_resolutivo",
    "condicion_resolutivo",
    "comentarios",
];

const licenciaDeFuncionamientoFormFields = [
    "nombre",
    "domicilio_notificaciones",
    "organismo",
    "telefono",
    "email",
    "nombre_comercial",
    "clave_registro_municipal",
    "direccion",
    "registro_federal_contribuyente",
    "registro_federal_pm",
    "horario_normal",
    "curp",
    "tipo_predio",
    "clave_catastral",
    "firma_inicio_operaciones",
    "fecha_expedicion",
    "giros",
    "fecha_inicio_operaciones",
    "razon_social",
    "regimen_capital",
];

const certificacionMedidasSeguridadFormFields = [
    "nombre",
    "fecha",
    "negocio",
    "giro",
    "direccion",
    "año_fiscal",
    "inspector",
    "inspector_2",
    "inspector_pi",
    "giro_pi",
];
export const ecologiaFormFields = [
    "encabezado_1",
    "negocio",
    "direccion",
    "giro",
    "generador_de",
    "numero_expediente",
    "otorga",
    "observaciones",
    "fecha_valido",
];

export const ecologiaFormFieldsFillFromSavedResolutivo = [
    "generador_de",
    "otorga",
    "observaciones",
    "numero_expediente",
    "fecha_valido",
];
const getNombreFromPersona = (negocio) => {
    return negocio?.persona_moral !== null &&
        negocio?.persona_moral !== undefined
        ? negocio?.persona_moral?.razon_social
        : `${negocio?.persona?.nombre ?? ""} ${negocio?.persona?.apellido_pat ?? ""
        } ${negocio?.persona?.apellido_mot ?? ""}`;
};
export const fillFormWithNegocioDataEcologia = (form, negocio) => {
    if (form === null) return;

    const giros = { giro: "" };
    negocio.giro_comercial.forEach((giro) => {
        giros.giro = giro.nombre + " " + giros.giro;
    });
    const direccion = `${negocio?.direccion?.calle_principal ?? ""} No.Ext.${negocio?.direccion?.numero_externo ?? " NA"
        } No.Int.${negocio?.direccion?.numero_interno ?? " NA"} ${negocio?.direccion?.calles ? "e/ " + negocio?.direccion?.calles : ""
        } C.P. ${negocio?.direccion?.codigo_postal}${negocio?.direccion?.colonia
            ? ` Col. ${negocio?.direccion?.colonia?.nombre_localidad}`
            : ""
        }`;
    form.setFieldsValue({
        encabezado_1: getNombreFromPersona(negocio),
        negocio: negocio?.nombre_del_negocio,
        direccion: direccion,
        giro: giros.giro,
        fecha_valido: moment(negocio?.fecha_creacion_tramite),
    });
};
export const fillFormWithResolutivoDataEcologia = (form, resolutivo) => {
    if (form === null) return;
    const formData = {};
    ecologiaFormFieldsFillFromSavedResolutivo.forEach((formItemName) => {
        formData[formItemName] = resolutivo[formItemName];
        if (formItemName === "fecha_valido") {
            formData[formItemName] = resolutivo.fecha_valido;
        }
    });
    form.setFieldsValue(formData);
};
export const checkGirosEnProgramaInterno = (giros, numEmpleadosTotales) => {
    let tienePI = false;
    giros.forEach((giro) => {
        if (girosComercialesPI.includes(giro?.clave_scian?.toString()) || numEmpleadosTotales >= 50) {
            tienePI = true;
        }
    });
    return tienePI;
};
const fillFormWithNegocioDataMedidasSeguridad = (form, negocio) => {
    if (form === null) return;
    const giros = { giro: "" };
    negocio?.giro_comercial.forEach((giro) => {
        giros.giro = giro.nombre + " " + giros.giro;
    });
    const direccion = `${negocio?.direccion?.calle_principal ?? ""} No.Ext.${negocio?.direccion?.numero_externo ?? " NA"
        } No.Int.${negocio?.direccion?.numero_interno ?? " NA"} ${negocio?.direccion?.calles ? "e/ " + negocio?.direccion?.calles : ""
        } C.P. ${negocio?.direccion?.codigo_postal}${negocio?.direccion?.colonia
            ? ` Col. ${negocio?.direccion?.colonia?.nombre_localidad}`
            : ""
        }`;

    form.setFieldsValue({
        nombre: getNombreFromPersona(negocio),
        negocio: negocio?.nombre_del_negocio,
        giro: giros?.giro,
        direccion: direccion,
    });
};
const fillFormWithResolutivoDataMedidasSeguridad = (form, resolutivo) => {
    if (form === null) return;
    const formData = {};
    certificacionMedidasSeguridadFormFields.forEach((formItemName) => {
        formData[formItemName] = resolutivo[formItemName];
        if (formItemName === "fecha") {
            formData[formItemName] = moment(resolutivo?.fecha);
        }

        if (formItemName === "año_fiscal") {
            formData[formItemName] = moment(resolutivo?.año_fiscal);
        }
    });
    form.setFieldsValue(formData);
};
const getFechaInicio = (string_date) => {
    return ` ${String(new Date(string_date).getDate()).padStart(
        2,
        "0"
    )} de ${moment(string_date).format("MMMM")} de ${moment(
        string_date
    ).format("YYYY")}`;
};

const getAntecedentesFromRequisitos = (revisiones) => {
    const revisionesParaEntidadActual =
        revisiones?.filter(
            (revision) =>
                revision?.entidad_revision_id ===
                Number(window?.user?.entidad_revision)
        ) ?? [];
    const antecedentes = revisionesParaEntidadActual?.map((revision) => {
        const requisitosPorRevision =
            revision?.negocio_requisitos_revision ?? [];
        const requisitos = requisitosPorRevision.map(
            (requisitoRevision) =>
                requisitoRevision?.requisito?.descripcion ?? ""
        );
        return requisitos ?? [];
    });
    let antecedentesString = "";
    antecedentes[0]?.forEach((antecedente) => {
        antecedentesString = antecedentesString + antecedente + "\n";
    }) ?? "";
    return antecedentesString;
};

const getPredioInfo = (form, negocio_data, setPredioInfo) => {
    axios
        .get("/app/get_comercio_token")
        .then((respuesta) => {
            axios
                .post("/app/get_info_123_", {
                    comercio_token: respuesta?.data?.token,
                    clave_folio: negocio_data?.clave_catastral ?? "",
                    tipo_predial: negocio_data?.tipo_predio ?? "U",
                })
                .then((response) => {
                    setPredioInfo(true);
                    form.setFieldsValue({
                        superficie: response?.data?.terreno ?? "",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    form.setFieldsValue({
                        superficie: "",
                    });
                });
        })
        .catch((error) => {
            console.log(error);
            form.setFieldsValue({
                superficie: "",
            });
        });
};

const setPredioInfoToFormLicenciaFuncionamiento = (
    form,
    negocio_data,
    setPredioInfo
) => {
    axios
        .get("/app/get_comercio_token")
        .then((respuesta) => {
            axios
                .post("/app/get_info_123_", {
                    comercio_token: respuesta?.data?.token,
                    clave_folio: negocio_data?.clave_catastral ?? "",
                    tipo_predial: negocio_data?.tipo_predio ?? "U",
                })
                .then((response) => {
                    setPredioInfo(true);
                    if (response.data.error != 'Not Found')
                        form.setFieldsValue({
                            clave_catastral: response?.data?.clave_catastral ?? "",
                            tipo_predio: getTipoPredio(response?.data?.tipo ?? ""),
                        });
                    else {
                        form.setFieldsValue({
                            clave_catastral: negocio_data?.clave_catastral ?? "",
                            tipo_predio: getTipoPredio(negocio_data?.tipo_predio ?? "U"),
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);

                    form.setFieldsValue({
                        clave_catastral: "",
                        tipo_predio: getTipoPredio(""),
                    });
                });
        })
        .catch((error) => {
            console.log(error);

            form.setFieldsValue({
                clave_catastral: "",
                tipo_predio: getTipoPredio(""),
            });
        });
};

const fillFormWithNegocioData = (form, negocio_data) => {
    const antecedentes = getAntecedentesFromRequisitos(
        negocio_data?.revisiones
    );
    form.setFieldsValue({
        fecha_inicio_tramite: getFechaInicio(
            negocio_data?.tramites?.[0].created_at ?? ""
        ),
        clave_catastral: negocio_data?.clave_catastral,
        tipo_predio: getTipoPredio(negocio_data.tipo_predio),
        quien_solicita: `${negocio_data?.persona?.nombre ?? ""} ${negocio_data?.persona?.apellido_pat ?? ""
            } ${negocio_data?.persona?.apellido_mot ?? ""}`,
        negocio: negocio_data?.nombre_del_negocio ?? "",
        direccion: `${negocio_data?.direccion?.calle_principal ?? ""} e/ ${negocio_data?.direccion?.calles ?? ""
            } ${negocio_data?.direccion?.numero_externo ?? ""} ${negocio_data?.direccion?.numero_interno ?? ""
            }`,
        antecedentes: antecedentes === "" ? "NA" : antecedentes,
    });
};
const getRules = (message) => {
    return [
        {
            required: true,
            message: message,
        },
    ];
};
const getFileObject = (values, keys) => {
    keys.forEach((valueName) => {
        values[valueName] = values[valueName]?.[0]?.originFileObj ?? "";
    });
    return { formData: jsonToFormData(values), values: values };
};

const buildFormData = (formDataObject, data, parentKey) => {
    if (
        data &&
        typeof data === "object" &&
        !(data instanceof Date) &&
        !(data instanceof File)
    ) {
        Object.keys(data).forEach((key) => {
            buildFormData(
                formDataObject,
                data[key],
                parentKey ? `${parentKey}[${key}]` : key
            );
        });
    } else {
        formDataObject.append(parentKey, data == null ? "" : data);
    }
};

export const jsonToFormData = (data) => {
    let formDataObject = new FormData();
    buildFormData(formDataObject, data);
    return formDataObject;
};
const groupHorario = (horario) => {
    const groupedHorario = {};
    Object.keys(horario).forEach((dia) => {
        if (groupedHorario[horario[dia]] === undefined) {
            groupedHorario[horario[dia]] = dia;
        } else {
            groupedHorario[horario[dia]] =
                groupedHorario[horario[dia]] + "," + dia;
        }
    });
    let horarioPorDia = "";
    Object.keys(groupedHorario).forEach((horario) => {
        if (horario !== undefined && horario !== "undefined")
            horarioPorDia =
                `${groupedHorario[horario]}:${horario}` + ", " + horarioPorDia;
    });
    return horarioPorDia.slice(0, -2);
};
export const getHorarioToDisplay = (horario) => {
    if (horario === null) return "";
    const horarioToDisplay = {};
    Object.keys(horario).forEach((hora) => {
        let dia = hora;
        if (dia.endsWith("c")) {
            dia = dia.slice(0, -1);
        }
        let letraDia = dia.charAt(0).toUpperCase();
        if (dia.toLocaleUpperCase() === "MIERCOLES") {
            letraDia = dia.slice(0, 2);
            letraDia = letraDia.charAt(0).toUpperCase() + letraDia.slice(1, 2);
        }
        if (horarioToDisplay[letraDia] === undefined) {
            horarioToDisplay[letraDia] = horario[dia];
        } else {
            if (hora.endsWith("c")) {

                if (horario[hora] == '00:00' && (horarioToDisplay[letraDia] == horario[hora]))
                    horarioToDisplay[letraDia] =
                        "24 hrs.";
                else
                    horarioToDisplay[letraDia] =
                        horarioToDisplay[letraDia] + " - " + horario[hora];
            }
        }
    });
    return groupHorario(horarioToDisplay);
};
const setLicenciaDeFuncionamientoFormDataFromNegocio = (negocio_data, form) => {
    const horario = negocio_data?.horarios
        ? JSON.parse(negocio_data?.horarios)
        : null;
    const direccion = `${negocio_data?.direccion?.calle_principal ?? ""
        } No.Ext.${negocio_data?.direccion?.numero_externo ?? " NA"} No.Int.${negocio_data?.direccion?.numero_interno ?? " NA"
        } ${negocio_data?.direccion?.calles
            ? "e/ " + negocio_data?.direccion?.calles ?? " NA"
            : ""
        } C.P. ${negocio_data?.direccion?.codigo_postal ?? " NA"}${negocio_data?.direccion?.colonia
            ? ` Col. ${negocio_data?.direccion?.colonia?.nombre_localidad}`
            : ""
        }`;
    const rfc_persona_moral =
        negocio_data?.persona_moral?.rfc !== null &&
            negocio_data?.persona_moral?.rfc !== undefined
            ? negocio_data?.persona_moral?.rfc
            : "NA";
    const regimen_capital =
        negocio_data?.persona_moral?.regimen_capital !== null &&
            negocio_data?.persona_moral?.regimen_capital !== undefined
            ? negocio_data?.persona_moral?.regimen_capital
            : "NA";
    const razon_social =
        negocio_data?.persona_moral?.razon_social !== null &&
            negocio_data?.persona_moral?.razon_social !== undefined
            ? negocio_data?.persona_moral?.razon_social
            : "NA";
    const rfc = negocio_data?.persona?.rfc ?? "";

    form.setFieldsValue({
        fecha_inicio_operaciones: getFechaInicio(
            negocio_data?.fecha_inicio_operaciones ?? ""
        ),
        clave_registro_municipal: negocio_data?.id.toString() ?? null,
        //nombre: getNombreFromPersona(negocio_data),
        nombre: `${negocio_data?.persona?.nombre ?? ""} ${negocio_data?.persona?.apellido_pat ?? ""
            } ${negocio_data?.persona?.apellido_mot ?? ""}`,
        telefono: negocio_data?.telefono ?? null,
        nombre_comercial: negocio_data?.nombre_del_negocio ?? null,
        direccion: direccion,
        capital_giro: Number(negocio_data?.inversion) ?? null,
        curp: negocio_data?.persona?.curp ?? null,
        clave_catastral: negocio_data?.clave_catastral ?? null,
        registro_federal_contribuyente: rfc,
        registro_federal_pm: rfc_persona_moral,
        horario_normal: getHorarioToDisplay(horario),
        giros: getGirosFromNegocioData(negocio_data?.giro_comercial ?? null),
        organismo: "Ninguno",
        venta_alcohol: negocio_data?.venta_alcohol ?? false,
        email: negocio_data?.persona?.email,
        razon_social: razon_social,
        regimen_capital: regimen_capital,
    });
};
const licenciaFormRules = [
    {
        required: true,
        message: "Este campo es requerido!",
    },
];
const getGirosFromNegocioData = (giros) => {
    if (giros === null) return null;
    let girosString = "";
    giros.forEach((giro) => (girosString = girosString + giro.nombre + ", "));
    return girosString.slice(0, -2);
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
    },
};
const tramitableTypesAlcoholes = ["App\Models\User","App\Models\PersonaMoral"];
const tramiteAlcoholesNames = ["Refrendo Licencia de Alcoholes","Licencia de Alcohol"]
const getTramiteAlcoholPagado = (negocio) => {
    const tramiteAlcoholes = { tramite_alcohol_pagado: false };
    const tramites = negocio.tramites.filter(tramite => {
        return tramiteAlcoholesNames.includes(tramite.catalogo_tramite.nombre)
    })
    if(tramites.length && tramites[0].avisos_entero.length) {
        tramiteAlcoholes.tramite_alcohol_pagado = tramites[0].avisos_entero[0].pagado === true
    }
    return tramiteAlcoholes?.tramite_alcohol_pagado;
};
const inspectorePI = [
    { id: 1, name: "T.U.M. MIGUEL AUDEL ÁLVAREZ GONZÁLEZ" },
    { id: 2, name: "T.U.M. MARTE JOAN LUNA OCHOA" },
    { id: 3, name: "EQUIPOS ESPECIALES DE SEGURIDAD" },
    { id: 4, name: "ING. HUMERTO PÉREZ AGUIRRE" },
    { id: 5, name: "BOMB. JUAN JESÚS RUIZ REDONA" },
    { id: 6, name: "T.U.M. JORGE MADRID LUGO" },
    { id: 7, name: "TEC. LUIS ENRIQUEZ GONZÁLEZ AVILÉS" },
    { id: 8, name: "T.S.U. CESÁR MARTÍN FERNÁNDEZ AJA" },
    { id: 9, name: "DR. GUILLERMO SANCHÉZ FLORES" },
    { id: 10, name: "T.U.M. LUÍS DANIEL HERNANDÉZ SIORDIA" },
    { id: 11, name: "ING.OSCAR GERARDO CANETT ROMERO" },
    { id: 12, name: "LIC. VÍCTOR HUGO CANETT" },
    { id: 13, name: "WILLIAM ALEJANDRO CASTILLO TOSCANO" },
    { id: 14, name: "LIC. GABRIEL ALBERTO ROBLES GUTIÉRREZ" },
    { id: 15, name: "C.A.P. ROGELIO RODRÍGUEZ WILLIAMS" },
    { id: 16, name: "LIC. ÁNGELA CONCEPCIÓN COTA ROMERO" },
    { id: 17, name: "ING. JAZIEL CIENFUEGOS MENDOZA" },
    { id: 18, name: "ING. JESÚS JAVIER MAYORAL MEDINA" },
    { id: 19, name: "T.U.M. GENARO SÁNCHEZ ARAUJO" },
    { id: 20, name: "ING. JOSÉ CARLOS YAÑEZ OSUNA" },
    { id: 21, name: "LIC. ALEJANDRO MORALES ROMERO" },
    { id: 22, name: "LIC. JAIR ALBERTO ZAVALZA GONZÁLEZ" },
    { id: 23, name: "ING. GUILLERMO SILVA HERNÁNDEZ" },
    { id: 24, name: "LIC. JESÚS MANUEL VILLA SÁNCHEZ" },
    { id: 25, name: "LIC. ALEXANDRO CASTELLANOS ARREOLA" },
    { id: 26, name: "CAP. JOSÉ DÍAS AVILÉS" },
];
const inspectorePIEx = [
    { 'id': 1, 'name': "Sebastián del Valle Reynoso" },
    { 'id': 2, 'name': "Víctor Hugo Canett Romero" },
    { 'id': 3, 'name': "Jonathan Adán Aguilar Castro" },
    { 'id': 4, 'name': "José Carlos Yañez Osuna" },
    { 'id': 5, 'name': "Genero Sánchez Araujo" },
    { 'id': 6, 'name': "Yahir Alberto Zavalza González" },
    { 'id': 7, 'name': "Dulce Susana Arce Villavicencio" },
    { 'id': 8, 'name': "Alejandro Morales Romero" },
    { 'id': 9, 'name': "Guadalupe Manuel Bojórquez Corrales" },
    { 'id': 10, 'name': "Elizabeth Acosta Ortiz" },
    { 'id': 11, 'name': "Marte Joan Luna Ochoa" },
    { 'id': 12, 'name': "Equipos Especiales de Seguridad, S.A. de C.V." },
    { 'id': 13, 'name': "Consultoría Integral en Gestión de Riesgos y Administración de Emergencias de México. S.A de C.V" },
    { 'id': 14, 'name': "José Díaz Aviléz" },
    { 'id': 15, 'name': "Jesús Javier Mayoral Medina" },
    { 'id': 16, 'name': "Manuel Guillermo Silva Hernández" },
    { 'id': 17, 'name': "Miguel Audel Álvarez Gónzalez" },
    { 'id': 18, 'name': "Lorenzo Antonio Contreras Rubio" },
    { 'id': 19, 'name': "Oscar Gerardo Canett Romero" },
    { 'id': 20, 'name': "Sinoe Pedro Israel Torres Ruíz" },
    { 'id': 21, 'name': "Asesoría en Seguridad Industrial, Emergencias y Capacitación S.A. de C.V." },
    { 'id': 22, 'name': "Guillermo Sánchez flores" },
    { 'id': 23, 'name': "Jacsiry Patricia Pérez Angulo" },
    
];

export {
    formItemLayout,
    getFileObject,
    getRules,
    licenciaFormRules,
    formItemLayoutWithOutLabel,
    fillFormWithNegocioData,
    setPreviewImageFromForm,
    clearPreviewImageFromForm,
    getTipoPredio,
    getDescripcionUbicacion,
    usoDeSueloFormFields,
    getFechaInicio,
    getAntecedentesFromRequisitos,
    getPredioInfo,
    licenciaDeFuncionamientoFormFields,
    setPredioInfoToFormLicenciaFuncionamiento,
    setLicenciaDeFuncionamientoFormDataFromNegocio,
    fillFormWithResolutivoDataMedidasSeguridad,
    fillFormWithNegocioDataMedidasSeguridad,
    certificacionMedidasSeguridadFormFields,
    getNombreFromPersona,
    getTramiteAlcoholPagado,
    inspectorePI,
    inspectorePIEx
};
