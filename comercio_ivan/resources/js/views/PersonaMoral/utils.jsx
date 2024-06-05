export const validarDatosRequeridos = (_direccion, setNotificacionData) => {
    if (hasValue(_direccion?.codigo_postal_colonia?.codigo_postal) === false) {
        setNotificacionData({
            title: "Código postal no seleccionado",
            description: "Debe seleccionar un código postal.",
            open: true,
            type: "error",
        });
        return false;
    }

    if (hasValue(_direccion?.codigo_postal_colonia?.colonia_id) === false || _direccion?.codigo_postal_colonia?.colonia_id === -1) {
        setNotificacionData({
            title: "Colonia no seleccionada",
            description: "Debe seleccionar una colonia.",
            type: "error",
            open: true,
        });
        return false;
    }

    if (hasValue(_direccion?.coordenadas?.latitud) === false || hasValue(_direccion?.coordenadas?.longitude) === false) {
        setNotificacionData({
            title: "Ubicación en el mapa",
            description: "Debe seleccionar una ubicación en el mapa.",
            type: "error",
            open: true,
        });
        return false;
    }
    if (hasValue(_direccion?.calle_principal) === false) {
        setNotificacionData({
            title: "Calle principal no seleccionada",
            description: "Debe indicar la calle principal.",
            type: "error",
            open: true,
        });
        return false;
    }
    return true;
};
export const rfc_regex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
export const hasValue = (value) => {
    return value !== null && value !== undefined && value !== ""
}
export function convertStringsToUppercase(obj, keysToOmmit = null) {
    // Check if the input is an object
    if (typeof obj === 'object' && obj !== null) {
        // If it's an array, iterate over its elements and apply the conversion recursively
        if (Array.isArray(obj)) {
            return obj.map(item => convertStringsToUppercase(item));
        } else {
            // If it's an object, iterate over its properties and apply the conversion recursively
            const newObj = {};
            for (let key in obj) {
                if ((keysToOmmit?.includes(key) ?? false) === false)
                    newObj[key] = convertStringsToUppercase(obj[key]);
                else {
                    newObj[key] = obj[key];
                }
            }
            return newObj;
        }
    } else if (typeof obj === 'string') {
        // If it's a string, convert it to uppercase
        return obj.toUpperCase();

    } else {
        // If it's neither an object nor a string, return it as is
        return obj;
    }
}
