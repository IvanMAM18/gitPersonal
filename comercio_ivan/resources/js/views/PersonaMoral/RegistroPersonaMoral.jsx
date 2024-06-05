import React, { useEffect, useState } from "react";
import { Tabs } from "antd";

import InformacionGeneral from "./InformacionGeneral";

export default function RegistroPersonaMoral({ setRegister }) {
    let allDataToSave = { negocio_id: -1 };
    const setAllDataToSave = (_allDataToSave) => {
        allDataToSave = { ...allDataToSave, ..._allDataToSave };
    };
    const getAllDataToSave = () => allDataToSave;

    const items = [
        {
            key: "1",
            label: `Información general`,
            children: (
                <InformacionGeneral
                    getAllDataToSave={getAllDataToSave}
                    setAllDataToSave={setAllDataToSave}
                    setRegister={setRegister}
                />
            ),
        },
    ];
    return <Tabs defaultActiveKey="1" items={items} />;
}
