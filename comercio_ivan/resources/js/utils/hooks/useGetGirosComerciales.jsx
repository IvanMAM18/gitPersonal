import axios from "axios";
import { useState } from "react";

export default function useGetGirosComerciales() {
    const [girosComerciales, setGirosComerciales] = useState([]);

    const getGirosComerciales = () => {
        axios
            .get("/app/get_giros_comerciales_registro")
            .then((response) => {
                setGirosComerciales(response.data);
            })
            .catch((error) => console.log(error));
    };

    return [girosComerciales, getGirosComerciales];
}
