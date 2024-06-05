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
            ">Trámite:</span>
            {{ $tramite }}
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
            ">Estatus:</span>
            {{ $status }}
        </p>
        <p style="font-size:16px;">
            <span style="
            font-size:20px;font-weight:700;color:#222;
            ">Observaciones:</span>
            {{ $observaciones }}
        </p>
        <ul>
            @foreach ($requisitos as $r)
                <li>{{ $r }}</li>
            @endforeach
        </ul>
        <div style="margin-top:30px;text-align:center;font-weight:700;font-size:30px;padding:15px;">Todos los documentos
            solicitados deben entregarse a través del sistema en línea.</div>
    </div>
</div>
