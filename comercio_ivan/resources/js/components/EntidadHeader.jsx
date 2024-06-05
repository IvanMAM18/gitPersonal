import { useState } from "react";

export default function EntidadHeader() {

    const [user] = useState(window.user);

    return (
        <div className="flex justify-end bg-white">

            <div className="text-right p-3 w-full shadow h-24">
                <div className="text-xl md:text-2xl font-bold w-full bg-red-">
                    {user.nombre} {user.apellido_paterno} <span className="hidden md:inline-block">{user.apellido_materno}</span>
                </div>

                {(user.entidad_revision && ["EntidadRevisora", "EntidadRevisoraDirector"].includes(user.role)) && (
                    <div className="md:text-lg text-red-800 font-bold italic">
                        <span>{user.entidad_revision_nombre}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
