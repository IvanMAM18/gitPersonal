import React, { useState, useEffect } from "react";
import { Card, Image, Button, notification, Modal, Tag, Space, Table }
    from 'antd'
import axios from "axios";
import useNegocioDetallesEntidadRevisora from "@/utils/hooks/useNegocioDetallesEntidadRevisora";
import status from "@/utils/statuses";
import { green } from "tailwindcss/colors";



export default function CondicionantesGrid({ condicionantes }) {

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text) => <a>{text}</a>
        },

    ];

    return (
        <>
            <Table columns={columns} dataSource={condicionantes} />
        </>
    )
}