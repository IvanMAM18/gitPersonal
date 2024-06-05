export const validarDatosRequeridos = (_direccion, setNotificacionData) => {
    if (_direccion?.codigo_postal === null) {
        setNotificacionData({
            title: "Código postal no seleccionado",
            description: "Debe seleccionar un código postal.",
            open: true,
            type: "error",
            setNotificationData: setNotificacionData,
        });
        return false;
    }

    if (_direccion?.colonia_id === null || _direccion?.colonia_id === -1) {
        setNotificacionData({
            title: "Colonia no seleccionada",
            description: "Debe seleccionar una colonia.",
            open: true,
            type: "error",
            setNotificationData: setNotificacionData,
        });
        return false;
    }

    if (_direccion?.latitud === null) {
        setNotificacionData({
            title: "Latitud no seleccionada",
            description: "Debe seleccionar una ubicación en el mapa.",
            open: true,
            type: "error",
            setNotificationData: setNotificacionData,
        });
        return false;
    }
    if (
        _direccion?.calle_principal === null ||
        _direccion?.calle_principal === ""
    ) {
        setNotificacionData({
            title: "Calle principal no seleccionada",
            description: "Debe indicar la calle principal.",
            open: true,
            type: "error",
            setNotificationData: setNotificacionData,
        });
        return false;
    }

    if (_direccion?.longitude === null) {
        setNotificacionData({
            title: "Longitud no seleccionada",
            description: "Debe seleccionar una ubicación en el mapa.",
            open: true,
            type: "error",
            setNotificationData: setNotificacionData,
        });
        return false;
    }
    return true;
};
