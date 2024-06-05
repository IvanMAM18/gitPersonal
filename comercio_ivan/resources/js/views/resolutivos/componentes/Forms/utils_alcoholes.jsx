import { getHorarioToDisplay } from "../../utils";
export const alcoholesFormFields = [
    "nombre_propietario",
    "curp_propietario",
    "rfc_propietario",
    "registro_federal_pm_propietario",
    "telefono_propietario",
    "domicilio_notificaciones_propietario",
    "email_propietario",
    "razon_social_propietario",
    "regimen_capital_propietario",
    "no_licencia_2",
    "tipo",
    "nombre_comercial_operador",
    "direccion_operador",
    "no_licencia_operador",
    "clave_registro_municipal_operador",
    "antecedentes",
];

export const setAlcoholesFormDataFromNegocio = (
    tramite,
    form,
    setFormaDataReady
) => {
    const propietario = tramite?.licencia?.propietario;
    const operador = tramite?.negocio_operador;

    const horario = tramite?.licencia
        ?.negocio_operador?.horarios
        ? JSON.parse(tramite?.licencia
            ?.negocio_operador?.horarios)
        : null;
    const rfc_persona_moral_propietario =
        !!propietario?.rfc
            ? propietario?.rfc
            : "NA";

    const regimen_capital_propietario =
        !!propietario?.regimen_capital !== null ? propietario?.regimen_capital
            : "NA";
    const razon_social_propietario =
        !!propietario?.razon_social ? propietario?.razon_social
            : "NA";

    const formFields = {
        nombre_propietario: propietario?.nombre ?? propietario?.razon_social,
        curp_propietario:
            propietario?.curp ?? "NA",
        rfc_propietario:
            propietario?.rfc ?? "NA",
        registro_federal_pm_propietario: rfc_persona_moral_propietario,
        telefono_propietario: propietario?.telefono ?? "NA",
        email_propietario:
            propietario?.email ?? "NA",
        razon_social_propietario: razon_social_propietario,
        regimen_capital_propietario: regimen_capital_propietario,
        /////
        horario_normal: getHorarioToDisplay(horario),
        no_licencia_2: operador?.licencia_alcohol?.licencia?.folio,
        tipo: operador?.licencia_alcohol?.licencia?.tipo,
        //////
        nombre_comercial_operador: operador?.nombre_del_negocio,
        direccion_operador: getDireccionFromNegocio(operador),
        no_licencia_operador: operador?.licencia_alcohol?.licencia?.clave,
        clave_registro_municipal_operador: tramite?.id?.toString() ?? null,
        domicilio_notificaciones_propietario: tramite?.domicilio_notificaciones_propietario?.toUpperCase()
        ,
    };

    Object.keys(formFields).forEach((key) => {
        if (typeof formFields[key] === "string") {
            formFields[key] = formFields[key]?.toUpperCase();
        }
    });

    form.setFieldsValue(formFields);
    setFormaDataReady(true);
};

const getNombreFromPersona = (negocio) => {
    return negocio?.persona_moral !== null &&
        negocio?.persona_moral !== undefined
        ? negocio?.persona_moral?.razon_social
        : `${negocio?.persona?.nombre ?? ""} ${negocio?.persona?.apellido_pat ?? ""
        } ${negocio?.persona?.apellido_mot ?? ""}`;
};

const getDireccionFromNegocio = (tramite) => {
    return `${tramite?.direccion?.calle_principal ?? ""} No.Ext.${tramite?.direccion?.numero_externo ?? " NA"
        } No.Int.${tramite?.direccion?.numero_interno || " NA"} ${tramite?.direccion?.calles !== null ? "e/ " + tramite?.direccion?.calles : ""
        } C.P. ${tramite?.direccion?.codigo_postal || " NA"}${tramite?.direccion?.colonia
            ? ` Col. ${tramite?.direccion?.colonia?.nombre_localidad || "NA"}`
            : ""
        }`;
};
export const getDireccionString = (direccion) => {
    console.log({ direccion });
    return `${direccion?.calle_principal ?? ""} No.Ext.${direccion?.numero_externo ?? " NA"
        } No.Int.${direccion?.numero_interno || " NA"} ${direccion?.calles ? "e/ " + direccion?.calles : ""
        } C.P. ${direccion?.codigo_postal || " NA"}${direccion?.colonia
            ? ` Col. ${direccion?.colonia?.nombre_localidad || "NA"}`
            : ""
        }`;
};
export const fillFormWithResolutivoDataAlcoholes = (form, resolutivo) => {
    if (form === null) return;
    const formData = {};
    alcoholesFormFields.forEach((formItemName) => {
        formData[formItemName] = resolutivo[formItemName];
    });
    console.log({ formData });
    form.setFieldsValue(formData);
};
