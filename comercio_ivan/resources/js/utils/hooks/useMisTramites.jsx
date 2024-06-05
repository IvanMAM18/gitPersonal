import { useState, useEffect } from "react";

export default function useMisTramites() {
    const [tramites, setTramites] = useState({
        tramites_personas: null,
        tramites: null,
        mis_tramites: null,
        mis_tramites_persona: null,
    });
    function customComparator(a, b) {
        const order = {
            "LICENCIA DE FUNCIONAMIENTO": 1,
            "REFRENDO LICENCIA DE FUNCIONAMIENTO": 2,
            "REFRENDO DE LICENCIA DE ALCOHOLES": 3
        };

        return order[a?.nombre?.toUpperCase()] - order[b?.nombre?.toUpperCase()];
    }
    const fetchTramites = () => {
        axios.get("/app/tramites").then((result) => {
            console.log(result.data);
            const tramitesForTables = [...result.data.tramites, ...result.data.tramites_persona];


            setTramites({
                ...result.data,
                tramites: tramitesForTables.filter(tramite => tramite.nombre.includes("Licencia")).sort(customComparator),
                tramites_persona: tramitesForTables.filter(tramite => tramite.nombre.includes("Licencia") === false)
            });
        });
    };
    useEffect(() => {
        fetchTramites();
    }, []);
    return tramites;
}
