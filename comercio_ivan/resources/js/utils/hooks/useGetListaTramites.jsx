import axios from "axios";
import { useState } from "react";

export default function useGetListaTramites() {
    const [tramites, setTramites] = useState([]);

    const getTramites = () => {
        axios.get("/app/dashadmin_get_todos_los_tramites").then((result) => {
            console.log("SET TRAMITES: ", result?.data)
            setTramites(result?.data ?? []);
        });
    };

    return [tramites, getTramites];
}
