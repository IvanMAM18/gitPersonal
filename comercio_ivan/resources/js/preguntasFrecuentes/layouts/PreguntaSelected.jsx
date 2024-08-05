import React, { useEffect, useState } from "react";
import { Button, Space, Menu, Divider, Row, Col, Layout } from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import useWindowWidth from "../../utils/hooks/useWindowWith";


export default function PreguntaSelected({ preguntaSelect, indexSelect}) {

    const windowWidth = useWindowWidth();
    const [selectedTitlePregunta, setSelectedTitlePregunta] = useState(indexSelect);
    const [cambio, setCambio] = useState(true);

    
    const handleButtonClick = (title) => {
        setCambio(false);
        setSelectedTitlePregunta(title);
    };
    // useEffect(() => {
    //     setCambio(true);
    //   });

    console.log(indexSelect);
    console.log(selectedTitlePregunta);
    console.log(preguntaSelect);
    console.log(windowWidth);
    return (
        <>
            {
                <div className="w-full py-14">  
                    <div className={`${windowWidth <= 600 ? '' : 'flex'}`}>
                        <div className={`w-11/12  ${windowWidth <= 600 ? 'px-2 mx-auto' : 'px-4 ml-8'} py-4 shadow-xl shadow-red-200 rounded-lg border-2 border-red-900`}>
                            <div className="text-center">
                                <span className="text-xl text-red-900 font-bold subpixel-antialiased">{preguntaSelect.preguntas[selectedTitlePregunta].title}</span>
                            </div>
                            <div className="subpixel-antialiased pt-4" dangerouslySetInnerHTML={{ __html: preguntaSelect.preguntas[selectedTitlePregunta].content }} />
                        </div>
                        <div className={`${ windowWidth <= 600 ? 'w-11/12 px-2 mx-auto' : 'w-7/12 px-4' } my-4 `}>
                            <p className="text-lg font-medium">Ayuda - {preguntaSelect.subtitle}</p>
                            {
                                preguntaSelect.preguntas.map((pregunta, index)=>(
                                    <React.Fragment key={index}>
                                        {
                                            (index === selectedTitlePregunta) ? 
                                                (
                                                    <div 
                                                        className="cursor-default text-red-900 font-bold"
                                                    >
                                                        <Space>
                                                            <QuestionCircleOutlined className="my-1"/>
                                                            {pregunta.title}
                                                        </Space>
                                                    </div> 
                                                ) 
                                            : 
                                                (
                                                    <div 
                                                        className="py-1.5 cursor-pointer hover:text-red-900 hover:font-medium"
                                                        onClick={ () => handleButtonClick(index) }
                                                    >
                                                        <Space>
                                                            <QuestionCircleOutlined className="my-1"/>
                                                            {pregunta.title}
                                                        </Space>
                                                    </div>
                                                )
                                        }
                                        
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }             
        </>
    );
}
