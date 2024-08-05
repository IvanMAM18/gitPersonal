import React, { useEffect, useState } from "react";
import { Space } from "antd";
import {
    QuestionCircleOutlined,
    DownOutlined,
    UpOutlined
} from "@ant-design/icons";
import { preguntasFrecuentes } from "../utils/preguntas";

export default function Main({ preguntasSelect, optionSelect ,idPreguntaSelectMain }) {

    const [selectedTitle, setSelectedTitle] = useState('');

    const handleButtonClick = (idPregunta) => {
        idPreguntaSelectMain(idPregunta);
    };

    const handleButtonSelectClick = (itemSelect) => {
        optionSelect(itemSelect);
        selectedTitle === itemSelect ? setSelectedTitle('')
        : setSelectedTitle(itemSelect);
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
                <div className="w-9/12 mx-auto antialiased">
                    <img src="/imagenes/ESCUDO_color.png" className="w-4/12 mx-auto" />
                    <p className="pb-2 text-red-900 text-3xl antialiased font-bold text-center">Bienvenido al Centro de Ayuda</p>
                    <p className="font-medium">Aquí puedes encontrar respuestas a las preguntas más frecuentes.</p>
                </div>
                <div className="w-9/12 h-full mb-4 border-2 border-red-900 mx-auto rounded-lg">
                    {
                        preguntasSelect.map((preguntas, index) => (
                            <React.Fragment key={index}>
                                <div className={
                                            `${selectedTitle === index ? '' : 'hover:shadow hover:shadow-red-950 hover:bg-red-900 hover:text-white'}`
                                        }>
                                    <div
                                        key={index}
                                        className={
                                            `w-full p-2 shadow border-red-900 cursor-pointer ease-in-out duration-300
                                            ${index === preguntasSelect.length - 1 ? '' : 'shadow-red-300'}`
                                        }
                                        onClick={() => handleButtonSelectClick(index)}
                                    >
                                        <div className="flex">
                                            <Space className="pl-4 w-full">
                                                <QuestionCircleOutlined className="my-1.5" />
                                                <span className="text-base font-semibold subpixel-antialiased">{preguntas.subtitle}</span>
                                            </Space>
                                            <div className='text-red-400'>
                                                {
                                                    selectedTitle === index ? 
                                                    <UpOutlined className="mr-3"/>  :
                                                    <DownOutlined className="mr-3"/> 
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        selectedTitle === index ? (
                                            <div className="bg-red-100 w-full ease-in-out duration-300">
                                                <div className="pl-8 py-2 bg-white font-medium cursor-default">{preguntas.description}</div>
                                                {
                                                    preguntas.preguntas.map((pregunta, idPregunta) => (
                                                        <React.Fragment key={idPregunta}>
                                                            <div 
                                                                className="pl-8 py-2 hover:bg-red-950 cursor-pointer hover:text-white"
                                                                onClick={() => handleButtonClick(idPregunta)} 
                                                            > 
                                                                {pregunta.title}
                                                            </div>
                                                        </React.Fragment>
                                                ))
                                                }
                                            </div>
                                        ):(
                                            <span></span>
                                        )
                                    }
                                </div>       
                            </React.Fragment>
                            )
                        )
                    }
                </div>
                <br />
            </div>
        </>
    );
}
