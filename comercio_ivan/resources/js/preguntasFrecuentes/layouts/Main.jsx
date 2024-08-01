import React, { useEffect, useState } from "react";
import { Space } from "antd";
import {
    QuestionCircleOutlined,
    DownOutlined
} from "@ant-design/icons";
import { preguntasFrecuentes } from "../utils/preguntas";

export default function Main({ preguntasSelect, idPreguntaSelectMain }) {

    const [selectedTitle, setSelectedTitle] = useState('');

    const handleButtonClick = (idPregunta) => {
        idPreguntaSelectMain(preguntasSelect[idPregunta]);
    };

    const handleButtonSelectClick = (itemSelect) => {
        setSelectedTitle(itemSelect);
    };

    // useEffect(() => {
    //     document.addEventListener('click', handleClick);
    //     return () => {
    //       document.removeEventListener('click', handleClick);
    //     };
    // }, []);

    return (
        <>
            <div className="px-4 pt-2 w-full h-full">
                <h2 className="text-red-900 text-center font-bold">Bienvenido al Centro de Ayuda</h2>
                <h6 className="pt-2 pl-44">Aquí puedes encontrar respuestas a las preguntas más frecuentes.</h6>
                <div className="w-9/12 h-full border-2 border-red-900 mx-auto rounded-lg">
                    {
                        preguntasSelect.map((preguntas, index) => (
                            <div
                                key={index}
                                className={
                                    `w-full p-2 shadow border-red-900 cursor-pointer hover:shadow hover:shadow-red-950 hover:bg-red-900 hover:text-white 
                                    ${index === preguntasSelect.length - 1 ? '' : 'shadow-red-300'}`
                                }
                                onClick={() => handleButtonSelectClick(index)}
                            >
                                <Space className="pl-4">
                                    <QuestionCircleOutlined className="my-1.5" />
                                    <span className="text-base font-semibold subpixel-antialiased">{preguntas.subtitle}</span>
                                </Space>
                                {
                                    selectedTitle === index?(
                                        <div className="bg-red-200 w-full">
                                            <span>{preguntas.description}</span>
                                            <br />
                                            {
                                                
                                                 preguntas.preguntas.map((pregunta, idPregunta) => (
                                                     <React.Fragment key={idPregunta}>
                                                         <span>{pregunta.title}</span>
                                                         <br />
                                                     </React.Fragment>
                                             ))
                                            }
                                        </div>
                                    ):(
                                        <span></span>
                                    )
                                }
                            </div>
                        )
                    )}
                </div>
                {/* <div className="grid grid-cols-3 gap-6 pt-4 pb-4">
                    {preguntasSelect.map((preguntas, index) => (
                        <div
                            key={index}
                            className="w-full h-48 rounded-lg p-4 border-2 shadow-lg shadow-red-300 border-red-900 cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white"
                            onClick={() => handleButtonClick(index)}
                        >
                            <Space>
                                <QuestionCircleOutlined className="mb-7" />
                                <p className="text-2xl font-semibold subpixel-antialiased">{preguntas.subtitle}</p>
                            </Space>
                            <div className="pl-3">
                                <p className="subpixel-antialiased">{preguntas.description}</p>
                            </div>
                        </div>
                    ))}
                </div> */}
            </div>
        </>
    );
}
