import {Input, Select } from "antd";
import axios from "axios";
import {useEffect, useState} from "react";
import {regimenFiscalesPersonasFisicas} from '@/v2/utils/RegimenFiscales'

export default function UsuarioForm({data, setData, errors}) {

    const [entidadRevisoras, setEntidadRevisoras] = useState([])

    useEffect(() => fetchEntidadRevisoras(), [])

    const fetchEntidadRevisoras = () => {
        axios.get("/v2/api/entidad-revisoras")
            .then(response => {
                setEntidadRevisoras(response.data)
            })
            .catch(errors => {
                console.log(errors)
            })
    }

    return (
        <div>

            {/*Correo Electronico*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="email">Correo Electrónico</label>
                <Input id="email"
                       value={data.email}
                       placeholder="fulanitodetal@ejemplo.com"
                       onChange={event => setData('email', event.target.value)} />
                <div className="text-xs text-app">{errors.email}</div>
            </div>

            {/*Telefono*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="telefono">Telefono</label>
                <Input id="telefono"
                       value={data.telefono}
                       onChange={event => setData('telefono', event.target.value)} />
                <div className="text-xs text-app">{errors.telefono}</div>
            </div>

            {/*Contraseña*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="password">Contraseña</label>
                <Input.Password id="password"
                       value={data.password}
                       onChange={event => setData('password', event.target.value)} />
                <div className="text-xs text-app">{errors.password}</div>
            </div>

            {/*Confirmar Contraseña*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="password_confirmation">Confirmar Contraseña</label>
                <Input.Password id="password_confirmation"
                       value={data.password_confirmation}
                       onChange={event => setData('password_confirmation', event.target.value)} />
            </div>

            <hr/>

            {/*Nombre*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="nombre">Nombre</label>
                <Input id="nombre"
                       value={data.nombre}
                       onChange={event => setData('nombre', event.target.value)} />
                <div className="text-xs text-app">{errors.nombre}</div>
            </div>

            {/*Apellido Paterno*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="apellido_pat">Apellido Paterno</label>
                <Input id="apellido_pat"
                       value={data.apellido_pat}
                       onChange={event => setData('apellido_pat', event.target.value)} />
                <div className="text-xs text-app">{errors.apellido_pat}</div>
            </div>

            {/*Apellido Materno*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="apellido_mot">Apellido Materno</label>
                <Input id="apellido_mot"
                       value={data.apellido_mot}
                       onChange={event => setData('apellido_mot', event.target.value)} />
                <div className="text-xs text-app">{errors.apellido_mot}</div>
            </div>

            {/*RFC*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="rfc">RFC</label>
                <Input id="rfc"
                       value={data.rfc}
                       onChange={event => setData('rfc', event.target.value)} />
                <div className="text-xs text-app">{errors.rfc}</div>
            </div>

            {/*CURP*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="curp">CURP</label>
                <Input id="curp"
                       value={data.curp}
                       onChange={event => setData('curp', event.target.value)} />
                <div className="text-xs text-app">{errors.curp}</div>
            </div>

            {/*Regimen Fiscal */}
            <div className="mb-4 flex flex-col">
                <label className="font-medium mb-0" htmlFor="regimen_fiscal">Regimen Fiscal</label>
                <Select id="regimen_fiscal"
                        value={data.regimen_fiscal}
                        onChange={value => setData('regimen_fiscal', value)} >

                    <Select.Option value="">Ninguna</Select.Option>
                    {regimenFiscalesPersonasFisicas.map(regimenFiscal =>
                        <Select.Option key={regimenFiscal.id}
                                       value={regimenFiscal.id}>
                            {regimenFiscal.name}
                        </Select.Option>
                    )}
                </Select>

                <div className="text-xs text-app">{errors.regimen_fiscal}</div>
            </div>

            {/*Entidad Revisora*/}
            <div className="mb-4 flex flex-col">
                <label className="font-medium mb-0" htmlFor="entidad_revision_id">Entidad Revisora</label>
                <Select id="entidad_revision_id"
                        value={data.entidad_revision_id}
                        onChange={value => setData('entidad_revision_id', value)} >

                    <Select.Option value="">Ninguna</Select.Option>
                    {entidadRevisoras.map(entidad =>
                        <Select.Option key={entidad.id}
                                       value={entidad.id}>
                            {entidad.nombre}
                        </Select.Option>
                    )}
                </Select>

                <div className="text-xs text-app">{errors.entidad_revision_id}</div>
            </div>

        </div>
    )
}
