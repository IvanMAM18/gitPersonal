import { useEffect, useState } from "react";

import { Button, Checkbox, Col, Row, message } from "antd";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const scheduleObj = {
    lunesObj: null,
    martesObj: null,
    miercolesObj: null,
    juevesObj: null,
    viernesObj: null,
    sabadoObj: null,
    domingoObj: null,
    lunesObjc: null,
    martesObjc: null,
    miercolesObjc: null,
    juevesObjc: null,
    viernesObjc: null,
    sabadoObjc: null,
    domingoObjc: null,
    lunesDisabled: null,
    martesDisabled: null,
    miercolesDisabled: null,
    juevesDisabled: null,
    viernesDisabled: null,
    sabadoDisabled: null,
    domingoDisabled: null,
};

export default function Horario({
    setScheduleForm,
    setHorarioFaltante,
    negocioId,
}) {
    const [schedule, setSchedule] = useState(scheduleObj);
    useEffect(() => {
        saveSchedule(schedule);
    }, [schedule]);
    const saveSchedule = (_schedule) => {
        //setScheduleForm(schedule);
        const cleanSchedule = {
            lunes: _schedule?.lunesObj?.format("HH:mm"),
            martes: _schedule?.martesObj?.format("HH:mm"),
            miercoles: _schedule?.miercolesObj?.format("HH:mm"),
            jueves: _schedule?.juevesObj?.format("HH:mm"),
            viernes: _schedule?.viernesObj?.format("HH:mm"),
            sabado: _schedule?.sabadoObj?.format("HH:mm"),
            domingo: _schedule?.domingoObj?.format("HH:mm"),
            lunesc: _schedule?.lunesObjc?.format("HH:mm"),
            martesc: _schedule?.martesObjc?.format("HH:mm"),
            miercolesc: _schedule?.miercolesObjc?.format("HH:mm"),
            juevesc: _schedule?.juevesObjc?.format("HH:mm"),
            viernesc: _schedule?.viernesObjc?.format("HH:mm"),
            sabadoc: _schedule?.sabadoObjc?.format("HH:mm"),
            domingoc: _schedule?.domingoObjc?.format("HH:mm"),
        };
        const alert = Object.keys(cleanSchedule).filter(
            (day) =>
                cleanSchedule[day] !== undefined && cleanSchedule[day] !== null
        );
        if (alert.length === 0) {
            //message.error("Eliga un horario");

            if (setScheduleForm === null || setScheduleForm === undefined) {
                setHorarioFaltante(null, negocioId);
            } else {
                setScheduleForm(null);
            }
            return;
        }
        console.log(cleanSchedule);
        if (setScheduleForm === null || setScheduleForm === undefined) {
            setHorarioFaltante(cleanSchedule, negocioId);
        } else {
            setScheduleForm(cleanSchedule);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Row gutter={[15, 15]} style={{ margintop: 15, marginBottom: 30 }}>
                <Col span={8}>
                    <TimePicker
                        label="Lunes Apertura"
                        value={schedule.lunesObj}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                lunesObj: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.lunesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Lunes Cierre"
                        value={schedule.lunesObjc}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                lunesObjc: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.lunesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <Checkbox
                        onChange={(e) => {
                            setSchedule((prev) => ({
                                ...prev,
                                lunesObj: null,
                                lunesObjc: null,
                                lunesDisabled: e.target.checked,
                            }));
                        }}
                    >
                        Cerrado
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Martes Apertura"
                        value={schedule.martesObj}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                martesObj: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.martesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Martes Cierre"
                        value={schedule.martesObjc}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                martesObjc: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.martesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <Checkbox
                        onChange={(e) => {
                            setSchedule((prev) => ({
                                ...prev,
                                martesObj: null,
                                martesObjc: null,
                                martesDisabled: e.target.checked,
                            }));
                        }}
                    >
                        Cerrado
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Miercoles Apertura"
                        value={schedule.miercolesObj}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                miercolesObj: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.miercolesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Miercoles Cierre"
                        value={schedule.miercolesObjc}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                miercolesObjc: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.miercolesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <Checkbox
                        onChange={(e) => {
                            setSchedule((prev) => ({
                                ...prev,
                                miercolesObj: null,
                                miercolesObjc: null,
                                miercolesDisabled: e.target.checked,
                            }));
                        }}
                    >
                        Cerrado
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Jueves Apertura"
                        value={schedule.juevesObj}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                juevesObj: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.juevesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Jueves Cierre"
                        value={schedule.juevesObjc}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                juevesObjc: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.juevesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <Checkbox
                        onChange={(e) => {
                            setSchedule((prev) => ({
                                ...prev,
                                juevesObj: null,
                                juevesObjc: null,
                                juevesDisabled: e.target.checked,
                            }));
                        }}
                    >
                        Cerrado
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Viernes Apertura"
                        value={schedule.viernesObj}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                viernesObj: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.viernesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Viernes Cierre"
                        value={schedule.viernesObjc}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                viernesObjc: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.viernesDisabled}
                    />
                </Col>
                <Col span={8}>
                    <Checkbox
                        onChange={(e) => {
                            setSchedule((prev) => ({
                                ...prev,
                                viernesObj: null,
                                viernesObjc: null,
                                viernesDisabled: e.target.checked,
                            }));
                        }}
                    >
                        Cerrado
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Sábado Apertura"
                        value={schedule.sabadoObj}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                sabadoObj: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.sabadoDisabled}
                    />
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Sábado Cierre"
                        value={schedule.sabadoObjc}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                sabadoObjc: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.sabadoDisabled}
                    />
                </Col>
                <Col span={8}>
                    <Checkbox
                        onChange={(e) => {
                            setSchedule((prev) => ({
                                ...prev,
                                sabadoObj: null,
                                sabadoObjc: null,
                                sabadoDisabled: e.target.checked,
                            }));
                        }}
                    >
                        Cerrado
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Domingo Apertura"
                        value={schedule.domingoObj}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                domingoObj: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.domingoDisabled}
                    />
                </Col>
                <Col span={8}>
                    <TimePicker
                        label="Domingo Cierre"
                        value={schedule.domingoObjc}
                        onChange={(newValue) =>
                            setSchedule((prev) => ({
                                ...prev,
                                domingoObjc: newValue,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                        disabled={schedule.domingoDisabled}
                    />
                </Col>
                <Col span={8}>
                    <Checkbox
                        onChange={(e) => {
                            setSchedule((prev) => ({
                                ...prev,
                                domingoObj: null,
                                domingoObjc: null,
                                domingoDisabled: e.target.checked,
                            }));
                        }}
                    >
                        Cerrado
                    </Checkbox>
                </Col>
            </Row>
        </LocalizationProvider>
    );
}
