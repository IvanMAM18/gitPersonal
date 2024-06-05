<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="{{ asset('css/micss.css') }}" rel="stylesheet">
    <title>Document</title>
</head>
<body>

<table style = "border:none">
  
    <tr>
        
        <td width="20%" style = "border: none; text-align: center" >
            <img src="{{ asset('imagenes/aguila3.jpg') }}" width="100" height="100">
        </td>
    
      <td width="60%" style = "border:none">
            <P style = "text-align: center; font-size:14; margin: 0; font-weight:bold">
                H. XVII AYUNTAMIENTO DE LA PAZ
            </P>
            <P style = "text-align: center; font-size:10; margin: 0; font-weight:bold">
                LICENCIA DE FUNCIONAMIENTO PARA GIROS ESTABLECIDOS
                COMERCIALES, INDUSTRIALES Y DE SERVICIOS
            </P>
            <P style = "text-align: center; font-size:30; margin: 0; font-weight:bold"> {{ isset($actyear)?$actyear:'' }} </P>
        </td>
    
      <td width="20%" style = "font-size:14; text-align: center; margin: 0; font-weight: bold; border:none">
          FOLIO:00917
        </td>

    </tr>

</table>

<div style="border: 1px solid; border-radius: 10px 10px 10px 10px">

    <table style="border: hidden">

        <tr>
            <td colspan="2" width="100%" style = "border:hidden">
                <P style = "text-align: center; font-size:12; margin: 0; font-weight:bold">DATOS DEL CAUSANTE</P>
            </td>
        </tr>

        <tr>
        <td colspan="2" width="100%" style = "font-size:8; text-align: center; border:hidden">
            {{ isset($solicitud->apellido1_sol)?$solicitud->apellido1_sol:'' }} 
            {{ isset($solicitud->apellido2_sol)?$solicitud->apellido2_sol:'' }}  
            {{ isset($solicitud->nombre_sol)?$solicitud->nombre_sol:'' }}   
        </td>     
        </tr>

        <tr>
            <td colspan="2" width="100%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                NOMBRE O RAZON SOCIAL
            </td>
        </tr>
        <tr>
            <td colspan="2" width="100%" style = "text-align: center; font-size:8; border:hidden">
            {{ isset($cat_domicilio->calle)?$cat_domicilio->calle:'' }} 
            {{ isset($cat_domicilio->entre)?$cat_domicilio->entre:'' }}  
            {{ isset($cat_domicilio->yentre)?$cat_domicilio->yentre:'' }}       
            </td>
        </tr>
        <tr>
            <td colspan="2" width="100%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                DOMICILIO PARA OIR Y RECIBIR NOTIFICACIONES
            </td>
        </tr>
        <tr>
            <td width="50%" style = "font-size:8; border:hidden">
            {{ isset($cat_contactalos->telefono)?$cat_contactalos->telefono:'' }} 
            </td>
            <td width="50%" style = "text-align: right; font-size:8; border:hidden">
                {{ isset($solicitud->correo_representante)?$solicitud->correo_representante:'' }} 
            </td>
        </tr>
        <tr>
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                TELEFONO
            </td>            
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none;font-weight:bold; text-align: right">
                CORREO ELECTRONICO
            </td>
        </tr>

        <tr>
            <td width="50%" style = "font-size:8; border:hidden">
            {{ isset($cat_camaras->descripcion)?$cat_camaras->descripcion:'' }} 
            </td>
            <td width="50%" style = "text-align: right;font-size:8; border:hidden">
                {{ isset($solicitud->ssa)?$solicitud->ssa:'' }} 
            </td>
        </tr>
        <tr>
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                ORGANISMO AL QUE PERTENECE
            </td>            
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none;font-weight:bold; text-align: right">
                NO. DE REGISTRO S.S.A.
            </td>
        </tr>

    </table>

</div>

<br>

<div style="border: 1px solid; border-radius: 10px 10px 10px 10px">

    <table style="border: hidden">
        <tr>
            <td width="50%" style = "font-size:8; border:hidden">
            {{ isset($solicitud->nombre_establecimiento)?$solicitud->nombre_establecimiento:'' }} 
            </td>
            <td width="50%" style = "text-align: right; font-size:8; border:hidden">
                {{ isset($solicitud->claveregmpal)?$solicitud->claveregmpal:'' }} 
            </td>
        </tr>
        <tr>
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                NOMBRE COMERCIAL DEL ESTABLECIMIENTO
            </td>            
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none;font-weight:bold; text-align: right">
                CLAVE DEL REGISTRO MUNICIPAL
            </td>
        </tr>

        <tr>
            <td width="50%" style = "font-size:8; border:hidden">
            {{ isset($cat_dom->calle)?$cat_dom->calle:'' }} 
            {{ isset($cat_dom->entre)?$cat_dom->entre:'' }}  
            {{ isset($cat_dom->yentre)?$cat_dom->yentre:'' }}       
            </td>
            <td width="50%" style = "text-align: right; font-size:8; border:hidden">
                {{ isset($solicitud->clavecatastral)?$solicitud->clavecatastral:'' }} 
            </td>
        </tr>
        <tr>
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                UBICACION (CALLE, AVENIDA, ETC.)
            </td>            
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none;font-weight:bold; text-align: right">
                CLAVE CATASTRAL
            </td>
        </tr>

        <tr>
            <td width="50%" style = "font-size:8; border:hidden">
            {{ isset($tipnegocio->descripcion)?$tipnegocio->descripcion:'' }} 
            </td>
            <td width="50%" style = "text-align: right; font-size:8; border:hidden">
                {{ isset($solicitud->capital)?$solicitud->capital:'' }} 
            </td>
        </tr>
        <tr>
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                CLASE DE GIRO
            </td>            
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none;font-weight:bold; text-align: right">
                CAPITAL EN GIRO
            </td>
        </tr>

        <tr>
            <td width="50%" style = "font-size:8; border:hidden">
            {{ isset($solicitud->rfc_sol)?$solicitud->rfc_sol:'' }} 
            </td>
            <td width="50%" style = "text-align: right; font-size:8; border:hidden">
                {{ isset($solicitud->horario)?$solicitud->horario:'' }} 
            </td>
        </tr>
        <tr>
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                REGISTRO FEDERAL DE CAUSANTES
            </td>            
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none;font-weight:bold; text-align: right">
                HORARIO NORMAL UTILIZADO PARA TRABAJAR
            </td>
        </tr>

        <tr>
            <td width="50%" style = "font-size:8; border:hidden">
            {{ isset($solicitud->curp_sol)?$solicitud->curp_sol:'' }} 
            </td>
            <td width="50%" style = "text-align: right; font-size:8; border:hidden">
                {{ isset($fechaoperaciones)?$fechaoperaciones:'' }} 
            </td>
        </tr>
        <tr>
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none; font-weight:bold">
                C.U.R.P.
            </td>            
            <td width="50%" style = "font-size:8; border-bottom:none; border-right:none; border-left:none;font-weight:bold; text-align: right">
                FECHA DE INICIO DE OPERACIONES
            </td>
        </tr>

        <tr>
            <td colspan="2" width="100%"  style="border:none">
                <p></p>
            </td>
        </tr>        

        <tr>
            <td colspan="2" width="100%"  style="border:none">
                <hr style="width:50%; text-align:rigth; height:1px;border-width:0;background-color:black"> 
            </td>
        </tr>
        
        <tr>
            <td colspan="2" width="100%" style = "font-size:8; border:none; font-weight:bold; text-align: center">
                FIRMA DEL CAUSANTE
            </td>
        </tr>

    </table>
</div>    
<br>
<div style="border: 1px solid; border-radius: 10px 10px 10px 10px">

    <table style="border: hidden">

    <tr>
        <td colspan="2" width="100%" style = "border:hidden">
            <P style = "text-align: center; font-size:8; margin: 0; font-weight:bold">
                "LAS LICENCIAS OTORGADAS POR LA AUTORIDAD MUNICIPAL NO CONCEDEN A SUS TITULARES
                DERECHOS PERMANENTES NI DEFINITIVOS; EN TAL VIRTUD, LA AUTORIDAD QUE LA EXPIDE PODRA EN
                CUALQUIER MOMENTO, POR CAUSA JUSTIFICADA ACORDAR SU REVOCACION EN LOS CASOS QUE SEÑALA
                ESTA LEY"
            </P>
        </td>
    </tr>

    <tr>
        <td colspan="2" width="100%" style = "border:hidden">
            <P style = "text-align: right; font-size:8; margin: 0; font-weight:bold">
                LEY DE HACIENDA MUNICIPAL ART.117
            </P>
        </td>
    </tr>

    <tr>
        <td colspan="2" width="100%" style = "border:hidden">
            <P style = "text-align: center; font-size:9; margin: 0; font-weight:bold">
                ESTE DOCUMENTO TENDRA VALIDEZ SOLAMENTE EN EL PRESENTE AÑO FISCAL
            </P>
        </td>
    </tr>


    </table>
</div>    
<br>
<P style = "text-align: left; font-size:8; margin: 0; font-weight:bold">
    LUGAR Y FECHA DE EXPEDICION
</P>    

<div style="border: 1px solid; border-radius: 10px 10px 10px 10px">

    <table style="border: hidden">

        <tr>
            <td colspan="2" width="100%"  style="border:none">
                <p></p>
            </td>
        </tr>      

        <tr>
            <td width="50%" style = "border:none; text-align: center; font-size:8; font-weight:bold">
                C.P SARA MARÍA BELTRÁN NAVARRO
            </td>            
            <td width="50%" style = "border:none; font-size:8; font-weight:bold; text-align: center">
                C. OMAR ALEJANDRO ORANTES
            </td>
        </tr>

        <tr>
            <td width="50%"  style="border:none">
                <hr style="width:50%; text-align:rigth; height:1px;border-width:0;background-color:black"> 
            </td>

            <td width="50%"  style="border:none">
                <hr style="width:50%; text-align:rigth; height:1px;border-width:0;background-color:black"> 
            </td>

        </tr>

        <tr>
            <td width="50%" style = "text-align: center; font-size:8; border:none; font-weight:bold">
                TESORERIA MUNICIPAL
            </td>            
            <td width="50%" style = "font-size:8; border:none; font-weight:bold; text-align: center">
                DIRECTOR DE COMERCIO
            </td>
        </tr>

        <tr>
            <td colspan="2" width="100%"  style="border:none">
                <p></p>
            </td>
        </tr>        

    </table>

</div>    


</body>


</html>


