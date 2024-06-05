import moment from "moment";
import { Tag } from "antd";
import { constanciaInhabilitacionFields } from "./constants";

export const fillFormFromNegocioForConstanciaInhabilitacion = (
    form,
    tramite
) => {
    if (form === null) return;
    form.setFieldsValue({
        solicitante: tramite?.nombre_persona,
        curp: tramite?.curp ?? "",
    });
};

export const fillFormWithResolutivoDataConstanciaInhabilitacion = (
    form,
    resolutivo
) => {
    if (form === null || resolutivo === null) return;
    const formData = {};
    constanciaInhabilitacionFields.forEach((formItemName) => {
        formData[formItemName] = resolutivo[formItemName];
        if (formItemName === "fecha") {
            formData[formItemName] = moment(resolutivo?.fecha);
        }
    });
    form.setFieldsValue(formData);
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

export const getResolutivoStatus = (_resolutivo) => {
    switch (!!_resolutivo) {
        case false:
            return (
                <Tag
                    style={{ marginRight: 5 }}
                    key={Math.random()}
                    color={"volcano"}
                >
                    Resolutivo por revisar
                </Tag>
            );
        case true:
            if (_resolutivo?.folio === null || _resolutivo?.folio === "") {
                return (
                    <Tag
                        style={{ marginRight: 5 }}
                        key={Math.random()}
                        color={"gold"}
                    >
                        Resolutivo guardado
                    </Tag>
                );
            } else {
                return (
                    <Tag
                        style={{ marginRight: 5 }}
                        key={Math.random()}
                        color={"green"}
                    >
                        Resolutivo guardado y firmado
                    </Tag>
                );
            }

        default:
            return (
                <Tag
                    style={{ marginRight: 5 }}
                    key={Math.random()}
                    color={"geekblue"}
                >
                    Estado desconocido
                </Tag>
            );
    }
};
