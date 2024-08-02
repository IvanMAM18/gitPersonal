import React, { useEffect, useState } from "react";
import { Space } from "antd";
import { preguntasFrecuentes } from "../utils/preguntas.jsx";

export default function SideMenu({preguntasSelect}) {

    const [selectTitle, setSelectTitle] = useState('');
      
    const handleButtonClick = (idPregunta) => {
        setSelectTitle(idPregunta);
        if(idPregunta===''){
            preguntasSelect(preguntasFrecuentes);
        }else{
            preguntasSelect(preguntasFrecuentes[idPregunta]);
        }
    };

    return (
        <>
            <div className="flex bg-red-900">
                <div className="mx-2 cursor-pointer">
                    <Space>
                        <img src="/imagenes/ESCUDO_color.png" className="w-14 cursor-pointer ease-in-out duration-200" onClick={() => handleButtonClick('')}/>
                        <h5 className="mt-2 text-red-100 hover:font-bold ease-in-out duration-200" onClick={() => handleButtonClick('')}>Centro de ayuda</h5>
                    </Space>
                </div>
            </div>
        </>
    );
}
