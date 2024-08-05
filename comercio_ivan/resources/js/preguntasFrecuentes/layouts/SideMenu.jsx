import React, { useEffect, useState } from "react";
import { Space } from "antd";
import {LeftOutlined} from "@ant-design/icons";
import { preguntasFrecuentes } from "../utils/preguntas.jsx";

export default function SideMenu({preguntasSelect}) {

    const [selectTitle, setSelectTitle] = useState('');
      
    const handleButtonClick = (idPregunta) => {
        setSelectTitle(idPregunta);
        preguntasSelect('');
    };

    return (
        <>
            <div className=" bg-red-900">
                <div className="mx-2 cursor-pointer shadoe-xl">
                    <Space>
                        <img src="/imagenes/ESCUDO_color.png" className="w-14 cursor-pointer ease-in-out duration-200" onClick={() => handleButtonClick('')}/>
                        <h5 className="mt-2 text-red-50 hover:font-bold ease-in-out duration-200" onClick={() => handleButtonClick('')}>Preguntas frecuentes</h5>
                    </Space>
                </div>
                <div 
                    className="pt-2 bg-white"
                >
                    <div 
                        className="mx-2 w-48 text-red-900 font-bold text-center border-2 border-b-red-900 border-x-transparent border-t-transparent cursor-pointer 
                                    hover:text-red-800 hover:border-b-red-800"
                        onClick={() => handleButtonClick('')}
                    >
                        <Space>
                            <LeftOutlined className="my-1" />
                            <span>Centro de ayuda</span>
                        </Space>
                    </div>
                </div>
            </div>
        </>
    );
}
