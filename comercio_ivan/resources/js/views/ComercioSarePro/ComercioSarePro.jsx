import React from 'react';
import RolesRouter from "../RolesRouter";
import ComercioSareTable from './ComercioSareTable';

export default function ComercioSarePro() {
    return (
        <div style={{ backgroundColor: "white", padding: "15px" }}>
            <RolesRouter />

            <h2>PRO SARE - Negocios en trámite</h2>
            <ComercioSareTable />
        </div>
    )
}
