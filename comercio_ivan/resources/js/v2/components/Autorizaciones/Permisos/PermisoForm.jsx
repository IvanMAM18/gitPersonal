import {Input } from "antd";

export default function PermisoForm({data, setData, errors, editing}) {

    return (
        <div>

            {/*Nombre*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="nombre">Nombre</label>
                <Input id="nombre"
                       value={data.name}
                       placeholder="Ver Modelo"
                       onChange={event => setData('name', event.target.value)} />
                <div className="text-xs text-app">{errors.name}</div>
            </div>

            {/*Label*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="etiqueta">Etiqueta</label>
                <Input id="etiqueta"
                       value={data.label}
                       disabled={editing}
                       placeholder="index:create-model"
                       onChange={event => setData('label', event.target.value)} />
                <div className="text-xs text-app">{errors.label}</div>
            </div>

        </div>
    )
}
