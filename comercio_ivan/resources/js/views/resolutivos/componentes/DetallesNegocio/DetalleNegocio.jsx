import { Divider, Popover, Tag } from "antd";
import status from "../../../../utils/statuses";
import moment from "moment";

export default function DetalleNegocio({ negocio, useDivider = true }) {
    return (
        <div className="sare--descriptions-column">
            {useDivider ? (
                <Divider orientation="left" plain>
                    Negocio
                </Divider>
            ) : null}
            <p>
                <b>Nombre: </b> {negocio?.nombre_del_negocio}
            </p>
            <p>
                <b>Descripción de actividad: </b>{" "}
                {negocio?.descripcion_actividad}
            </p>
            <p>
                <b>Venta de alcohol: </b> {negocio?.venta_alcohol ? "Sí" : "No"}
            </p>

            <p>
                <b>Estado: </b>
                {status.tag(
                    
                        negocio.estador
                    
                )}
            </p>
            <p>
                <b>Teléfono: </b> {negocio?.telefono ?? "N/D"}
            </p>
            <p>
                <b>Fecha de registro: </b>
                {moment(negocio.created_at).format("YYYY/MM/DD")}
            </p>
            <p>
                <b>Descripcion de actividad: </b>
                {negocio?.descripcion_actividad ?? ""}
            </p>
            <p>
                <b>Cajones de estacionamiento: </b>
                {negocio.cajones_estacionamiento}
            </p>
            <p>
                <b>Tamaño Empresa: </b>
                    {negocio.tamano_empresa}
                </p>
        </div>
    );
}
