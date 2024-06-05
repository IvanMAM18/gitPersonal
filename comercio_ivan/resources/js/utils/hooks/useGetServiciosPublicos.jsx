import axios from "axios";
import { useState } from "react";

export default function useGetServiciosPublicos() {
    const [serviciosPublicos, setServiciosPublicos] = useState();

    const getServiciosPublicos = () => {
        axios
            .get("/app/get_servicios_publicos_para_giros_comerciales")
            .then((result) =>{
                setServiciosPublicos(
                    result?.data.map((servicio_publico) => ({
                        ...servicio_publico,
                        name: servicio_publico.nombre,
                        id: servicio_publico.id,
                        label: servicio_publico.nombre,
                    }))
                )
                console.log("setServiciosPublicos", result)
            }
                
            );
    };

    return [serviciosPublicos, getServiciosPublicos];
}
