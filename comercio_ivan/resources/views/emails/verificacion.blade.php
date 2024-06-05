<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verificación de correo electrónico</title>
</head>
<body>

    <div style="text-align:center;font-family:sans-serif;">
        <img src="https://comercio.lapaz.gob.mx/imagenes/ESCUDO_color.png" alt="Logo" width="200" style="margin-bottom:20px;align-self:center;">
        <h1>Verificación de correo electrónico</h1>
        <p>Hola {{ $nombre }}, por favor, haz clic en el siguiente enlace para verificar tu dirección de correo electrónico:</p>
        <a href="{{ url($ruta.'/'.$token) }}" style="background-color:#03A9F4;padding:10px 20px;color:white;text-decoration:none;display:inline-block;align-self:center;border-radius:10px;font-weight:bold;">VERIFICAR CORREO</a>
        <p>Si no has solicitado la verificación de correo electrónico, puedes ignorar este mensaje.</p>
    </div>
</body>
</html>
