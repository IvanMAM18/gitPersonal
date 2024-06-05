import axios from "axios";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export const deleteConfirm = (item, modelName, callbackDelete) => {
    confirm({
        title: `Desea borrar este elemento?`,
        icon: <ExclamationCircleOutlined />,
        content: "",
        okText: "Sí",
        okType: "danger",
        cancelText: "No",
        onOk() {
            axios
                .delete(`/app/eliminar_${modelName}/` + item.id)
                .then((response) => callbackDelete())
                .catch((errors) => console.log(errors));
        },
    });
};

const buildFormData = (formData, data, parentKey) => {
    if (
        data &&
        typeof data === "object" &&
        !(data instanceof Date) &&
        !(data instanceof File)
    ) {
        Object.keys(data).forEach((key) => {
            buildFormData(
                formData,
                data[key],
                parentKey ? `${parentKey}[${key}]` : key
            );
        });
    } else {
        const value = data == null ? "" : data;
        formData.append(parentKey, value);
    }
};

const jsonToFormData = (data) => {
    const formData = new FormData();
    buildFormData(formData, data);
    return formData;
};

export const nuevoRegistro = (
    formValues,
    model,
    successCallbackFunction,
    errorCallbackFuntion
) => {
    // if (formValues.banner !== "") { TODO Add support to files
    //     formValues.banner = formValues.banner[0].originFileObj;
    // }
    // if (formValues.banner_file !== "") {
    //     formValues.banner_file = formValues.banner_file[0].originFileObj;
    // }

    formValues = jsonToFormData(formValues);

    axios
        .post(`/app/dashadmin_${model}_store`, formValues, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
            successCallbackFunction(response);
        })
        .catch((error) => errorCallbackFuntion(error));
};

export const actualizarRegistro = (
    formValues,
    model,
    successCallbackFunction,
    errorCallbackFuntion
) => {
    // if (formValues.banner !== "") { TODO FILES SUPPORT
    //     formValues.banner = formValues.banner[0].originFileObj;
    // }
    // if (formValues.banner_file !== "") {
    //     formValues.banner_file = formValues.banner_file[0].originFileObj;
    // }
    const isUpdatingPassword = formValues["password"] !== undefined;
    formValues = jsonToFormData(formValues);
    const updateURL = isUpdatingPassword
        ? `/app/dashadmin_${model}_update_password`
        : `/app/dashadmin_${model}_update`;
    axios
        .post(updateURL, formValues, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => successCallbackFunction(response))
        .catch((error) => errorCallbackFuntion(error));
};
