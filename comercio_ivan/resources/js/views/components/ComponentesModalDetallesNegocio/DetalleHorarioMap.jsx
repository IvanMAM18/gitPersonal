import { Collapse } from "antd";
const { Panel } = Collapse;
import moment from "moment";
const d = (date) => moment(date).format("DD/MM/YYYY HH:mm a");

export default function DetalleHorarioMap({ negocio }) {
    const horarios = negocio?.horarios && JSON.parse(negocio?.horarios);
    return (
        <>
            {negocio?.created_at && (
                <div className="sare--descriptions-column">
                    {!!horarios && (
                        <div style={{ marginTop: 20 }}>
                            {/* <Divider orientation="left" plain>
                                Horarios
                            </Divider> */}

                            <Collapse bordered={false} >
                                <Panel header="Horarios" key="1" >
                                    <div style={{textAlign: 'left'}} >
                                    <p>
                                        <b className="label-info">Lunes: </b>
                                        <p>
                                            {horarios.lunes
                                                ? `ABRE: ${moment(horarios.lunes, "HH:mm").format("hh:mm a")} 
                                                CIERRA: ${moment(horarios.lunesc, "HH:mm").format("hh:mm a")}`
                                                : "CERRADO"}
                                        </p>
                                    </p>
                                    <p>
                                        <b className="label-info">Martes: </b>
                                        <p>
                                            {horarios.martes
                                                ? `ABRE: ${moment(horarios.martes, "HH:mm").format("hh:mm a")} 
                                                CIERRA: ${moment(horarios.martesc, "HH:mm").format("hh:mm a")}`
                                                : "CERRADO"}
                                        </p>
                                    </p>
                                    <p>
                                        <b className="label-info">Miércoles: </b>
                                        <p>
                                            {horarios.miercoles
                                                ? `ABRE: ${moment(horarios.miercoles, "HH:mm").format("hh:mm a")} 
                                                CIERRA: ${moment(horarios.miercolesc, "HH:mm").format("hh:mm a")}`
                                                : "CERRADO"}
                                        </p>
                                    </p>
                                    <p>
                                        <b className="label-info">Jueves: </b>
                                        <p>
                                            {horarios.jueves
                                                ? `ABRE: ${moment(horarios.jueves, "HH:mm").format("hh:mm a")} 
                                                CIERRA: ${moment(horarios.juevesc, "HH:mm").format("hh:mm a")}`
                                                : "CERRADO"}
                                        </p>
                                    </p>
                                    <p>
                                        <b className="label-info">Viernes: </b>
                                        <p>
                                            {horarios.viernes
                                                ? `ABRE: ${moment(horarios.viernes, "HH:mm").format("hh:mm a")} 
                                                CIERRA: ${moment(horarios.viernesc, "HH:mm").format("hh:mm a")}`
                                                : "CERRADO"}
                                        </p>
                                    </p>
                                    <p>
                                        <b className="label-info">Sábado: </b>
                                        <p>
                                            {horarios.sabado
                                                ? `ABRE: ${moment(horarios.sabado, "HH:mm").format("hh:mm a")} 
                                                CIERRA: ${moment(horarios.sabadoc, "HH:mm").format("hh:mm a")}`
                                                : "CERRADO"}
                                        </p>
                                    </p>
                                    <p>
                                        <b className="label-info">Domingo: </b>
                                        <p>
                                            {horarios.domingo
                                                ? `ABRE: ${moment(horarios.domingo, "HH:mm").format("hh:mm a")} 
                                                CIERRA: ${moment(horarios.domingoc, "HH:mm").format("hh:mm a")}`
                                                : "CERRADO"}
                                        </p>
                                    </p>
                                    </div>
                                    
                                </Panel>
                            </Collapse>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
