import { Divider } from "antd";
export default function DetalleHorario({ negocio }) {
    const horarios = negocio.horarios && JSON.parse(negocio.horarios);
    return (
        <>
            {!!negocio.created_at && (
                <div className="sare--descriptions-column">
                    {!!horarios && (
                        <div style={{ marginTop: 20 }}>
                            {/* <Divider orientation="left" plain>
                                Horarios
                            </Divider> */}
                            <p>
                                <b className="label-info">Lunes: </b>
                                <tt>
                                    {horarios.lunes
                                        ? `ABRE ${horarios.lunes} · CIERRA ${horarios.lunesc}`
                                        : "CERRADO"}
                                </tt>
                            </p>
                            <p>
                                <b className="label-info">Martes: </b>
                                <tt>
                                    {horarios.martes
                                        ? `ABRE ${horarios.martes} · CIERRA ${horarios.martesc}`
                                        : "CERRADO"}
                                </tt>
                            </p>
                            <p>
                                <b className="label-info">Miércoles: </b>
                                <tt>
                                    {horarios.miercoles
                                        ? `ABRE ${horarios.miercoles} · CIERRA ${horarios.miercolesc}`
                                        : "CERRADO"}
                                </tt>
                            </p>
                            <p>
                                <b className="label-info">Jueves: </b>
                                <tt>
                                    {horarios.jueves
                                        ? `ABRE ${horarios.jueves} · CIERRA ${horarios.juevesc}`
                                        : "CERRADO"}
                                </tt>
                            </p>
                            <p>
                                <b className="label-info">Viernes: </b>
                                <tt>
                                    {horarios.viernes
                                        ? `ABRE ${horarios.viernes} · CIERRA ${horarios.viernesc}`
                                        : "CERRADO"}
                                </tt>
                            </p>
                            <p>
                                <b className="label-info">Sábado: </b>
                                <tt>
                                    {horarios.sabado
                                        ? `ABRE ${horarios.sabado} · CIERRA ${horarios.sabadoc}`
                                        : "CERRADO"}
                                </tt>
                            </p>
                            <p>
                                <b className="label-info">Domingo: </b>
                                <tt>
                                    {horarios.domingo
                                        ? `ABRE ${horarios.domingo} · CIERRA ${horarios.domingoc}`
                                        : "CERRADO"}
                                </tt>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
