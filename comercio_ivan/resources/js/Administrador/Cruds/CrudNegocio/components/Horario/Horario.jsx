import { useEffect, useState } from "react";

import { Checkbox, Col, Row } from "antd";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
    scheduleObj,
    getCurrentSchedule,
    validateSchedule,
    getCleanSchedule,
} from "./utils";
import HorarioHeader from "./HorarioHeader";
import "./HorarioStyles.scss";

export default function Horario({
    negocioData,
    setHorario,
    horarios,
    setErrorEnHorario,
    errorEnHorario,
}) {
    const [schedule, setSchedule] = useState(scheduleObj);

    useEffect(() => {
        if (horarios !== null) {
            const currentSchedule = getCurrentSchedule(JSON.parse(horarios));
            setSchedule({ ...scheduleObj, ...currentSchedule });
        }
    }, []);

    useEffect(() => {
        saveSchedule(schedule);
    }, [schedule]);

    const saveSchedule = (_schedule) => {
        const cleanSchedule = getCleanSchedule(_schedule);
        const schedule = {};
        Object.keys(cleanSchedule).forEach((day) => {
            if (
                cleanSchedule[day] !== undefined &&
                cleanSchedule[day] !== null
            ) {
                schedule[day] = cleanSchedule[day];
            }
        });
        validateSchedule(schedule, setErrorEnHorario);
        setHorario?.({
            ...negocioData,
            horarios: Object.keys(schedule).length > 0 ? schedule : null,
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <HorarioHeader errorEnHorario={errorEnHorario} />
            <Row
                gutter={[
                    { xs: 8, sm: 16 },
                    { xs: 8, sm: 16 },
                ]}
            >
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
                        checked={schedule?.lunesDisabled ?? false}
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
                        checked={schedule?.martesDisabled ?? false}
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
                        checked={schedule?.miercolesDisabled ?? false}
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
                        checked={schedule?.juevesDisabled ?? false}
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
                        checked={schedule?.viernesDisabled ?? false}
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
                        checked={schedule?.sabadoDisabled ?? false}
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
                        checked={schedule?.domingoDisabled ?? false}
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
