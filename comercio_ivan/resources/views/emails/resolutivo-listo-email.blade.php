<div>
    <div style="display:flex;justify-content:space-between;">
        <h1 style="width:calc(100% - 120px); margin-left:15px;">
            H.XVII Ayuntamiento de La Paz, Sistema de Comercio
        </h1>
        <span style="width:200px;">
            <img src="https://comercio.lapaz.gob.mx/imagenes/ESCUDO_color.png" alt="{{ config('app.name') }}"
                style="width:100%;max-width:200px;" />
        </span>
    </div>
    <div style="border-radius:30px;
            background-color:#f8f8f8;
            padding:20px;">
        <p style="font-size:16px;">
            <span style="
            font-size:20px;font-weight:700;color:#222;
            ">Entidad que revisó:</span>
            {{ $entidad }}
        </p>
        <p style="font-size:16px;">
            <span style="
            font-size:20px;font-weight:700;color:#222;
            ">Establecimiento: </span>
            {{ $negocio }}
        </p>
        <p style="font-size:16px;">
            <span style="
            font-size:20px;font-weight:700;color:#222;
            ">Folio del
                resolutivo:</span>
            {{ $folio }}
        </p>
    </div>
</div>
