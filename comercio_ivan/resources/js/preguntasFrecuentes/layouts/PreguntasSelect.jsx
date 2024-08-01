import React, { useEffect, useState } from "react";
import { Button,Space } from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";


export default function PreguntasSelect({ preguntaSelect, idPreguntaSelect }) {
    const [selectedTitle, setSelectedTitle] = useState('');

    
    const handleButtonClick = (idPregunta) => {
        setSelectedTitle(idPregunta);
        idPreguntaSelect(preguntaSelect.preguntas[idPregunta]);
    };

    console.log(preguntaSelect.title);
    return (
        <>
            {
                <div className="w-full h-full">
                    <div className="w-9/12 mx-auto">
                        <span className=" text-red-900 text-3xl font-bold"> Preguntas Frecuentes - {preguntaSelect.subtitle}</span>
                    </div>
                    <div className="pt-6 pb-10 mx-auto w-9/12 rounded-lg">
                            {
                                preguntaSelect.preguntas.map((preguntas,index)=>(
                                    <React.Fragment key={index}>
                                        <div 
                                            className="w-full py-2.5 mb-1.5 border-2 border-red-900 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white ease-in-out duration-300"
                                            onClick={() => handleButtonClick(index)}
                                            >
                                            <Space className="pl-2">
                                                <QuestionCircleOutlined className="mb-1"/>
                                                <span className="subpixel-antialiased"> {preguntas.title} </span> 
                                            </Space>
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                    </div>
                </div> 
            }     
        </>
    );
}
