import { Divider } from "antd";
import NegociosTable from "./components/MisNegocios/NegociosTable";
import RolesRouter from "./RolesRouter";
import BotonRefrendar from "./components/MisNegocios/BotonRefrendar";
import React, { useEffect, useState } from "react";

const MisNegocios = () => {
    const [negocios, setNegocios] = useState();
    const refreshNegocios = () => {
        axios.get('/app/negocios')
            .then(result => {
                setNegocios(result.data)
            })
    }

    useEffect(() => {
        refreshNegocios();
    }, []);
    return (
        <div className="sare--container">
            <RolesRouter />
            <div className="mis_negocios_header">
                <h5>Mis negocios</h5>
                <BotonRefrendar negocios={negocios} refreshNegocios={refreshNegocios} />
            </div>
            <Divider />
            <NegociosTable negocios={negocios} />
        </div>
    );
}

export default MisNegocios;
