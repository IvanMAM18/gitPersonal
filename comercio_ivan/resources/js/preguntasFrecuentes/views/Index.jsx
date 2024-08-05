import React, { useEffect, useState } from "react";
import { Layout,Space } from "antd";
import { preguntasFrecuentes } from "../utils/preguntas";
import SideMenu from "../layouts/SideMenu.jsx";
import Main from "../layouts/Main.jsx";
import PreguntaSelected from "../layouts/PreguntaSelected.jsx";
import useWindowWidth from "../../utils/hooks/useWindowWith.jsx";



export default function PreguntasFrecuentes() {

  const [selectedOption, setSelectedOption] = useState('');
  const [titlePreguntaSelect, setTitlePreguntaSelect] = useState('');
  const [idSelectPregunta, setIdSelectPregunta] = useState('');

  const handleSelect = (item) => {
    setSelectedOption(item);
  };

  const handleTitlePreguntaSelect = (item) =>{
    setTitlePreguntaSelect(item);
  }
  
  const handlePreguntaSelect = (item) =>{
    setIdSelectPregunta(item);
    setSelectedOption('pregunta');
  }

  return (
    <div className="w-full h-full">
        <SideMenu preguntasSelect={handleSelect}/>
        {
          selectedOption === '' ?
            <Main preguntasSelect={preguntasFrecuentes} optionSelect={handleTitlePreguntaSelect} idPreguntaSelectMain={handlePreguntaSelect}/>
          : 
            <PreguntaSelected preguntaSelect={preguntasFrecuentes[titlePreguntaSelect]} indexSelect={idSelectPregunta}/>
        }
        {/* {
          selectedOption === '' ? 
            <Main preguntasSelect={preguntasFrecuentes} idPreguntaSelectMain={handleSelect}/>
          : selectedOption >= 1 ?
            <span>1 {selectedOption}</span>
          :
          <span> 2 {selectedOption}</span>
        } */}
        {/* <div className="w-full">
        {
          selectedOption.length >= 1 ? 
          (
            <Main preguntasSelect={selectedOption} idPreguntaSelectMain={handleSelect}/>
          ) : selectedOption === '' ? (
            <Main preguntasSelect={preguntasFrecuentes} idPreguntaSelectMain={handleSelect}/>
          ) : (
            idSelectPregunta === '' ? (
              <PreguntasSelect preguntaSelect={selectedOption} idPreguntaSelect={handleIddPreguntaSelect}/>
            ) : (
              <PreguntaSelected preguntaSelect={selectedOption} indexSelect={idSelectPregunta}/>
            )
          )
        }
        </div> */}
    </div>
  );
}
