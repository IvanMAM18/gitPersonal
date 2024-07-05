import {Input } from "antd";

export default function RoleForm({data, setData, errors, editing}) {

    return (
        <div>

            {/*Nombre*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="nombre">Nombre</label>
                <Input id="nombre"
                       value={data.nombre}
                       placeholder="Ver Modelo"
                       onChange={event => setData('nombre', event.target.value)} />
                <div className="text-xs text-app">{errors.nombre}</div>
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

            {/*Descripcion*/}
            <div className="mb-4">
                <label className="font-medium mb-0" htmlFor="descripcion">Descripción</label>
                <Input.TextArea rows={4} id="descripcion"
                                value={data.descripcion}
                                onChange={event => setData('descripcion', event.target.value)} />
                <div className="text-xs text-app">{errors.descripcion}</div>
            </div>

        </div>
    )
}
