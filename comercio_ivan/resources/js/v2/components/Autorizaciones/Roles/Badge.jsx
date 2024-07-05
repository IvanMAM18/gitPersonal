import {Tag} from "antd";

export default function RolBadge({rol}) {

    console.log(rol.label)
    const classColor = {
        "superadmin" : "orange",
        "entidad-revisora" : "red",
        "persona" : "blue",
        "comercio-admin" : "purple",
        "entidad-revisora-director" : "green",
        "comercio-director" : "geekblue",
        "comercio-admin-visor" : "cyan",
    }

    return (
        <Tag color={classColor[rol.label]} >{rol.nombre}</Tag>
    )
}

