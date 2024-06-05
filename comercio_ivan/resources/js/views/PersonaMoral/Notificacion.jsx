import { notification } from "antd";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

const Notificacion = forwardRef((props, ref) => {
    const [notificationData, setNotificacionData] = useState({
        title: "Datos actualizados",
        description: "",
        open: false,
        type: "success",
    });
    const [api, contextHolder] = notification.useNotification();

    useImperativeHandle(ref, () => ({
        showNotification({
            title = "Datos actualizados",
            description = "",
            type = "success",
            open = false,
        }) {
            setNotificacionData({
                title: title,
                description: description,
                open: open,
                type: type,
            });
        },
    }));

    useEffect(() => {
        if (notificationData?.open === true) {
            openNotificationWithIcon();
            setNotificacionData({
                open: false,
            });
        }
    }, [notificationData]);
    const openNotificationWithIcon = () => {
        api[notificationData?.type]({
            message: notificationData?.title,
            description: notificationData?.description,
        });
    };

    return <>{contextHolder}</>;
});

export default Notificacion;
