export const validarDatosRequeridos = (negocio, setNotificacionData) => {
    if (negocio?.nombre_del_negocio === null) {
        setNotificacionData({
            title: "Nombre Comercial",
            description: "Debe ingresar un nombre comercial.",
            open: true,
            type: "error",
            setNotificationData: setNotificacionData,
        });
        return false;
    }
    if (negocio?.superficie_m2 === null) {
        setNotificacionData({
            title: "Superficie",
            description: "La superficie no debe quedar vacia.",
            open: true,
            type: "error",
            setNotificationData: setNotificacionData,
        });
        return false;
    }

    if (negocio?.superficie_m2 <= 0) {
        setNotificacionData({
            title: "Superficie",
            description: "La superficie no debe mayor a cero.",
            open: true,
            type: "error",
            setNotificationData: setNotificacionData,
        });
        return false;
    }
    return true;
};
