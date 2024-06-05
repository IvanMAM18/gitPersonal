import React, { useState } from "react";

export default function useGetDireccion() {
    const [direccion, setDireccion] = useState(null);
    const getDireccion = async (id) => {
        const direccionData = await axios
            .get(`/app/get_direccion_por_id/${id}`)
            .catch((error) => {
                console.log(error);
            });
        setDireccion(direccionData?.data ?? null);
    };
    return [direccion, getDireccion];
}
