import { notification } from "antd";
import React, { useEffect } from "react";

export default function Notificacion({
    title,
    description,
    open,
    type = "info",
    setNotificationData,
}) {
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        if (open === true) {
            openNotificationWithIcon();
            setNotificationData?.({
                open: false,
            });
        }
    }, [open]);
    const openNotificationWithIcon = () => {
        api[type]({
            message: title,
            description: description,
        });
    };

    return <>{contextHolder}</>;
}
