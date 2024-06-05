import React, { useEffect } from "react";
import { Tabs } from "antd";
import DireccionesPersonaMoral from "./DireccionesPersonaMoral";
import useGetCodigosPostales from "../../../utils/hooks/useGetCodigosPostales";
import InformacionGeneral from "./InformacionGeneral";

export default function PersonaMoral({ personaMoral, setShowModal }) {
    const [codigosPostales, getCodigosPostales] = useGetCodigosPostales();

    useEffect(() => {
        getCodigosPostales();
    }, []);

    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: "1",
            label: `Información general`,
            children: (
                <InformacionGeneral
                    personaMoral={personaMoral}
                    setShowModal={setShowModal}
                />
            ),
        },
        {
            key: "2",
            label: `Direcciones`,
            children: (
                <DireccionesPersonaMoral
                    personaMoral={personaMoral}
                    codigosPostales={codigosPostales}
                />
            ),
        },
    ];
    return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
}
