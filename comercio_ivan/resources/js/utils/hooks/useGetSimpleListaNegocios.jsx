import axios from "axios";
import { useState } from "react";

export default function useGetSimpleListaNegocios() {
    const [listaNegocios, setListaNegocios] = useState(null);

    const getNegocio = (entidadRevisoraId, year) => {
        const url =
            entidadRevisoraId === 6 || entidadRevisoraId === "6"
                ? `/app/get_negocios_alcoholes_resolutivo_pago_info/${entidadRevisoraId}/${year}`
                : `/app/get_negocios_por_entidad_revisora_resolutivo_pago_info/${entidadRevisoraId}/${year}`;

        axios.get(url).then((result) => {
            result.data.map((negocio) => (negocio.key = negocio.id));
            console.log(result.data.find(n => n.id === 2792));
            setListaNegocios(result?.data ?? []);
        });
    };

    return [listaNegocios, getNegocio];
}
