import React, { useEffect, useState } from "react";
import { Button,Space, Menu, Divider, Row, Col,Layout } from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";


export default function PreguntaSelected({ preguntaSelect, indexSelect}) {
    const [selectedTitle, setSelectedTitle] = useState('');
    const [cambio, setCambio] = useState(true);

    
    const handleButtonClick = (title) => {
        setCambio(false);
        setSelectedTitle(title);
    };
    // useEffect(() => {
    //     setCambio(true);
    //   });

    console.log(indexSelect);
    console.log(preguntaSelect);
    console.log(selectedTitle);
    return (
        <>
            {

                    <div className="w-full h-full">
                        <div className="flex">
                            {
                                selectedTitle === '' ? (
                                    <div className="w-7/12 rounded-lg p-4 mx-8 border-2 border-red-900 mb-4">
                                        <h3 className="text-red-900 font-bold">{indexSelect.title}</h3>
                                        <div className="subpixel-antialiased pt-4" dangerouslySetInnerHTML={{ __html: indexSelect.content }} />
                                    </div>
                                ) : (
                                    <div className="w-7/12 rounded-lg p-4 mx-8 border-2 border-red-900 mb-4">
                                        <h3 className="text-red-900 font-bold">{preguntaSelect.preguntas[selectedTitle].title}</h3>
                                        <div className="subpixel-antialiased pt-4" dangerouslySetInnerHTML={{ __html: preguntaSelect.preguntas[selectedTitle].content }} />
                                    </div>
                                )
                            }
                            <div className="w-4/12 p-4 mb-4">
                                <h5 className="pb-4">Ayuda-{preguntaSelect.subtitle}</h5>
                                    {
                                        preguntaSelect.preguntas.map((preguntas,index)=>{
                                            if (selectedTitle === index) { // Condición para verificar si hay un título
                                                return (
                                                    <React.Fragment key={index}>
                                                        <Space className="pl-2 cursor-default font-bold text-red-900 mb-2">
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="subpixel-antialiased"> {preguntas.title} </span> 
                                                        </Space>
                                                    </React.Fragment>
                                                )
                                            }else{
                                                return (
                                                    <React.Fragment key={index}>
                                                        <Space 
                                                            className="pl-2 cursor-pointer hover:font-bold mb-2"
                                                            onClick={() => handleButtonClick(index)}
                                                        >
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="subpixel-antialiased"> {preguntas.title} </span> 
                                                        </Space>
                                                    </React.Fragment>
                                                )
                                            }
                                        })
                                    }
                            </div>
                        </div>
                    </div>
            }
                
                
                
        </>
    );
}
