import React, { useEffect, useState } from "react";
import { Layout,Space } from "antd";
import { preguntasFrecuentes } from "../utils/preguntas";
import SideMenu from "../layouts/SideMenu.jsx";
import useWindowWidth from "../../utils/hooks/useWindowWith.jsx";



export default function PreguntasFrecuentes() {

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelect = (item) => {
    setSelectedOption(item);
  };

  console.log(selectedOption);
      return (
        <div className="w-full h-full">
          <SideMenu preguntasSelect={handleSelect}/>
          <div className="w-9/12 pt-16 pl-2">
            {
              selectedOption ? (
                <p>{selectedOption.subtitle}</p>
              ) : (
                <span>Nada</span>
              )
            }
          </div>
        </div>
      );
}
