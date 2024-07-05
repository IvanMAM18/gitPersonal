import {Tag} from "antd";
import React from "react";

export default function SioNoTag({valor}) {
    return (
        <Tag className="w-12 text-center" color={valor ? 'green' : 'red'}>{valor ? "Sí" : "No"}</Tag>
    )
}
