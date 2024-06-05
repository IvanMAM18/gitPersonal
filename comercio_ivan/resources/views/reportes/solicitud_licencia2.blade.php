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

<div style=" background-color: #cdcdcd; border: 1px solid; border-radius: 10px 10px 10px 10px">

  <table style = "border:none">
    
    <tr>
      <td style = "border-right: none; text-align: center; border:none">
          <img src="{{ asset('imagenes/aguilasinfondo.png') }}" width="60" height="60">
      </td>


      <td style ="border:none">
        <P style = "text-align: center; font-size:10; margin: 0; font-weight:bold">
          FORMATO SOLICITUD MULTI-TRÁMITE
        </P>

        <P style = "text-align: center; font-size:8; margin: 0; font-weight:bold">
          LICENCIA DE FUNCIONAMIENTO
        </P>

        <P style = "text-align: center; font-size:10; margin: 0; font-weight:bold">
          MUNICIPIO DE LA PAZ, BAJA CALIFORNIA SUR
        </P>

        <P style = "text-align: center; font-size:8; margin: 0; font-weight:bold">
          TESORERIA MUNICIPAL
        </P>
      </td>

      <td style = "border-right: none; text-align: center; border:none">
          <img src="{{ asset('imagenes/logosare.png') }}" width="80" height="40">
      </td>

    </tr>

  </table>

</div>

<br>

<table style = "border:none">
  
    <tr style = "line-height:1.2">

        <td style = "font-size: 7.5; border:none">FOLIO DE LICENCIA DE FUNCIONAMIENTO:</td>
        
        <td style = "text-align: center;font-size:7.5;border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            {{ isset($datospdf->folio)?$datospdf->folio:'' }}
          </div>  
        </td>


      <td style = "font-size: 7.5; border:none">HORARIO DE FUNCIONAMIENTO:</td>

        <td style = "text-align: center;font-size:7.5; border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">  
            {{ isset($datospdf->horario)?$datospdf->horario:'' }}
          </div>  
        </td>

    </tr>

    <tr style = "line-height:1.2">     
        
      <td style = "font-size: 7.5;border:none">FECHA DE RECEPCIÓN:</td>

          <td style = "text-align: center;font-size:7.5;border:none">
            <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
              {{ isset($datospdf->fecha)?$datospdf->fecha:'' }}
            </div>  
          </td>

          <td style = "font-size: 7.5;border:none">FECHA DE ENTREGA:</td>

          <td style = "text-align: center;font-size:7.5;border:none"> 
            <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
              {{ isset($fechact)?$fechact:'' }}
            </div>  
          </td>

      </tr>
 
</table>

<br>

<table style = "border:none">
    
    <tr>
        
        <td style = "text-align: center; font-size:8;border:none; font-weight:bold">
          
          <div style="background-color:#BFC9CA; border: 1px solid">      
              PARA SER LLENADO POR EL SOLICITANTE
          </div>
 
          <P style = "text-align: center; font-size:7; margin: 0; font-weight:bold">
              CONSIDERACIONES INICIALES
          </P>
    
          <P style = "text-align: center; font-size:5; margin: 0; font-weight:normal">
              1.- Si Usted no cuenta con un local para establecer su negocio y ya conoce la
              actividad comercial que desea iniciar, se sugiere no contar en arrendamiento
              ni remodelar el local hasta no conocar el uson de suelo destinado al mismo
          </P>

        </td>

    </tr>

</table>

<table style = "border:none">

<tr>
  <td width="20%" style="border:none">
  </td>

  <td width="20%" style="border:none">
    <hr style="text-align:rigth; height:2px;border-width:0;color:gray;background-color:gray"> 
  </td>

  <td width="20%" style="text-align:center; font-size:9; font-weight: bold; margin: 0;border:none">
    DATOS GENERALES
  </td>

  <td width="20%" style="border:none">
    <hr style="text-align:left; height:2px;border-width:0;color:gray;background-color:gray"> 
  </td>

  <td width="20%" style="border:none">
  </td>
</tr>

</table>


<table style = "border:none">
    <tr>
      <td colspan="4" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        NOMBRE O RAZON SOCIAL
      </td>

      <td colspan="2" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        REGISTRO FEDERAL DE CONTRIBUYENTES (RFC)
      </td>  

    </tr>

    <tr>
      <td colspan="4" style = "text-align:center; font-size:7; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($datospdf->apellido1_sol)?$datospdf->apellido1_sol:'' }} 
          {{ isset($datospdf->apellido2_sol)?$datospdf->apellido2_sol:'' }}  
          {{ isset($datospdf->nombre_sol)?$datospdf->nombre_sol:'' }}   
        </div>  
      </td>

      <td colspan="2" style = "text-align:center; font-size:7; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($datospdf->rfc_sol)?$datospdf->rfc_sol:'' }} 
        </div>  
      </td>  

    </tr>

    <tr>
      <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        PRIMER APELLIDO
      </td>
      <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        SEGUNDO APELLIDO
      </td>
      <td colspan="2" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        NOMBRES(S)
      </td>
      <td colspan="2" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        CURP
      </td>
    </tr>

    <tr>
      <td colspan="1" style = "text-align:center; font-size:7; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($datospdf->apellido1_sol)?$datospdf->apellido1_sol:'' }} 
        </div>  
      </td>
      <td colspan="1" style = "text-align:center; font-size:7; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($datospdf->apellido2_sol)?$datospdf->apellido2_sol:'' }} 
        </div>  
      </td>  
      <td colspan="2" style = "text-align:center; font-size:7; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($datospdf->nombre_sol)?$datospdf->nombre_sol:'' }} 
        </div>  
      </td>  
      <td colspan="2" style = "text-align:center; font-size:7; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
        {{ isset($datospdf->curp_sol)?$datospdf->curp_sol:'' }}    
        </div>  
      </td>  

    </tr>  

    <tr>
        <td colspan="3" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
           NOMBRE O DENOMINACION COMERCIAL DEL ESTABLECIMIENTO
        </td>
        <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
            TELEFONO
        </td>
        <td colspan="2" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
            CORREO ELECTRONICO
        </td>
    </tr>

    <tr>
        <td colspan="3" style = "text-align:center; font-size:7; margin: 0; border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            {{ isset($datospdf->nombre_establecimiento)?$datospdf->nombre_establecimiento:'' }}    
          </div>  
        </td>  
        <td colspan="1" style = "text-align:center; font-size:7; margin: 0; border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            {{ isset($cat_contactalos_sol->telefono)?$cat_contactalos_sol->telefono:'' }}      
          </div>  
          </td>  
        <td colspan="2" style = "text-align:center; font-size:7; margin: 0; border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            {{ isset($datospdf->correo_representante)?$datospdf->correo_representante:'' }}     
          </div>  
        </td>
    </tr>

 </table>

  <table style = "border:none">  

    <tr>
        <td colspan="2" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
           DOMICILIO DEL ESTABLECIMIENTO (CALLE)
        </td>
        <td colspan="8" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
            USO
        </td>
    </tr>

    <tr>

        <td colspan="2" width="50%" style = "text-align:center; font-size:7; margin: 0; border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            {{ isset($cat_domicilio_esta->calle)?$cat_domicilio_esta->calle:'' }}     
            {{ isset($cat_domicilio_esta->entre)?$cat_domicilio_esta->entre:'' }}     
            {{ isset($cat_domicilio_esta->yentre)?$cat_domicilio_esta->yentre:'' }}     
          </div>  
        </td>  

        <td colspan="1" width="6%" style = "text-align:center; font-size:6; font-weight: bold; margin: 0; border:none">
          Bodega/Industrial
        </td> 

        <td colspan="1" width="6%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            @if($solicitudesr->uso == "BODEGA/INDUSTRIA")           
              X
              @else
                <p> </p>
            @endif        
          </div>  
        </td>    

        <td colspan="1" width="6%" style = "text-align:center; font-size:6; font-weight: bold; margin: 0; border:none">
          Comercio
        </td> 

        <td colspan="1" width="6%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            @if($solicitudesr->uso == "COMERCIO")           
              X   
              @else
                <p> </p>
            @endif      
          </div>  
        </td>

        <td colspan="1" width="6%" style = "text-align:center; font-size:6; font-weight: bold; margin: 0; border:none">
          Oficina
        </td>

        <td colspan="1" width="6%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            @if($solicitudesr->uso == "OFICINA")           
                X  
                @else
                <p> </p>
            @endif        
          </div>  
        </td> 

        <td colspan="1" width="6%" style = "text-align:center; font-size:6; font-weight: bold; margin: 0; border:none">
          Servicio
        </td> 

        <td colspan="1" width="6%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">      
            @if($solicitudesr->uso == "SERVICIO")           
                X   
                @else
                <p> </p>
            @endif        
          </div>  
        </td>

    </tr>

</table>

<table style = "border:none">

    <tr>
        <td width="10%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
            No INTERIOR
        </td>
        <td width="10%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          No EXTERIOR
        </td>
        <td width="70%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
            COLONIA, POBLACIÓN O FRACCIONAMIENTO
        </td>
        <td width="10%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
            CODIGO POSTAL
        </td>
    </tr>

    <tr style = "text-align:center; font-size:8; margin: 0">
        <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">      
            @if(isset($cat_domicilio_esta->numint))  
              {{$cat_domicilio_esta->numint}}
              @else
                <p></p> 
            @endif 
          </div>  
        </td>  
        <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">      
            @if(isset($cat_domicilio_esta->numext))  
              {{$cat_domicilio_esta->numext}}
                @else
                  <p></p> 
              @endif     
          </div>  
        </td>  
        <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
             @if(isset($cat_domicilio_esta->colonia))  
             {{$cat_domicilio_esta->colonia}}
                @else
                  <p></p> 
              @endif

              @if(isset($cat_domicilio_esta->localidad))  
              {{$cat_domicilio_esta->localidad}}
                  @else
                    <p></p> 
              @endif
        
          </div>  
        </td>
        <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">   
            @if(isset($cat_domicilio_esta->cp))  
                {{$cat_domicilio_esta->cp}}
                    @else
                      <p></p> 
              @endif   
          </div>  
        </td>    
    </tr>


</table>

<table style = "border:none">

  <tr>
      <td width="60%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        NOMBRE DEL APODERADO LEGAL (PERSONA JURÍDICA COLECTIVA)
      </td>
  
      <td width="40%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        USO ACTUAL
      </td>
  </tr>

  <tr>

    <td width="60%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">   
        @if(isset($datospdf->representate))  
                {{$datospdf->representate}}
                    @else
                      <p></p> 
              @endif  
      </div>           
    </td>  

    <td width="40%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">   
        @if(isset($datospdf->actividad_principal))  
                  {{$datospdf->actividad_principal}}
                      @else
                        <p></p> 
                @endif       
      </div>          
    </td>

  </tr>

  <tr>
      <td width="60%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        DESCRIPCIÓN DE LA ACTIVIDAD O GIRO PREPONDERANTE
      </td>
  
      <td width="40%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        CLAVE CATASTRAL
      </td>

  </tr>

  <tr>
    <td width="60%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">   
          @if(isset($datospdf->actividad_principal))            
             {{$datospdf->actividad_principal}}   
              @else
                  @if(isset($tipnegocio->descripcion))  
                          {{$tipnegocio->descripcion}}
                              @else
                                <p></p> 
                  @endif  
          @endif        
        </div>           
      </td>  

      <td width="40%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">   
          @if(isset($datospdf->clavecatastral))  
                    {{$datospdf->clavecatastral}}
                        @else
                          <p></p> 
                  @endif       
        </div>          
      </td>
  </tr>

</table>

<table style = "border:none">

    <tr>

      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        SUPERFICIE TOTAL DEL LOCAl M2:
      </td>

      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
          <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">     
            {{ isset($datospdf->superficie)?$datospdf->superficie:'' }}
          </div>  
      </td>

      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        NÚMERO DE CAJONES DE ESTACIONAMIENTO
      </td>

      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">       
            {{ isset($datospdf->num_cajones)?$datospdf->num_cajones:'' }}
          </div>  
      </td>

    </tr>  
</table>

<table style = "border:none">
<tr>
    <td width="25%" style="border:none"></td>
    <td width="25%" style = "text-align:right; font-size:7; font-weight: bold; margin: 0; border:none">
      CLAVE DE USUARIO SAPA
    </td>

    <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">       
          <p></p>
        </div>  
    </td> 
    <td width="25%" style="border:none"></td>
    
  </tr>
</table>


<table style = "border:none">

<tr>
  <td width="20%" style="border:none">
  </td>

  <td width="20%" style="border:none">
    <hr style="text-align:rigth; height:2px;border-width:0;color:gray;background-color:gray"> 
  </td>

  <td width="20%" style="text-align:center; font-size:9; font-weight: bold; margin: 0;border:none">
    REQUISITOS  
  </td>

  <td width="20%" style="border:none">
    <hr style="text-align:left; height:2px;border-width:0;color:gray;background-color:gray"> 
  </td>

  <td width="20%" style="border:none">
  </td>
</tr>

</table>


<table style = "border:none">
  <tr>
    <td style="border:none">
        <P style = "text-align: center; font-size:6; margin: 0">
          LA DOCUMENTACIÓN DEBERÁ PRESENTARSE EN ORIGINAL Y COPIA PARA SU COTEJO
        </P>      
    </td>
  </tr>     
</table>

<table style = "border:none">

<thead>
    <tr>
      <th width="33%" style = "border:none;font-size:7">APERTURA MEDIANO IMPACTO</th>
      <th width="33%" style = "border:none;font-size:7">REFRENDO</th>
      <th width="33%" style = "border:none;font-size:7">PERSONA MORAL</th>
    </tr>
  </thead>

  <tbody>
    <tr>
        <td width="1" style="border:none">
            <P style = "text-align: justify ; font-size:7; margin: 0; line-height:0.9">
            1.- Formato Único de Apertura ( debidamente llenado )<br>
            2.- Copia de Uso de suelo<br>
            3.- Tabla de requisitos adicionales con apego a las <br>
              disposiciones de ecología / Dictamen de ecología<br>
            4.- Copia de certificación de medidas de seguridad a <br>
              giros comerciales de protección civil<br>
            5.- Copia de pago de recolección de basura<br>  
            6.- Copia de identificación<br>
            7.- Copia legal del local (Contrato de arrendamiento
              y/o escrituras)
            </P>   
        </td>
    
        <td width="1" style="border:none">
          <P style = "text-align: justify ; font-size:7; margin: 0; line-height:0.9">
            1.- Copia de licencia de funcionamiento<br>
            2.- Copia de certificación de medidas de seguridad a <br>
              giros comerciales de protección civil<br>
            3.- Tabla de requisitos adicionales con apego a las <br>
              disposiciones de ecología / Dictamen de ecología<br>
            4.- Copia de pago de recolección de basura<br>
            5.- Copia de identificación<br>
            6.- Copia legal del local <br>
              (contrato de arrendamiento y/o escrituras)
          </P>     
        </td>
    
        <td width="1" style="border:none">
          <P style = "text-align: justify ; font-size:7; margin: 0; line-height:0.9">
            Ademas de los requisitos anteriormente mencionados:<br>

            1.-Copia del Acta Constitutiva<br>
            2.-Poder notarial del representante legal
          </P>     
        </td>
    </tr>   
  </tbody>  

</table>

<table style = "border:none">
<thead>
    <tr>
        <th style = "border:none"></th>
        <th style = "border:none"></th>
        <th style = "border:none"></th>
        <th style = "border:none"></th>
    </tr>    
  </thead>

  <tbody>

  <tr>
    <td colspan="4" style = "border:none">
      <P style = "text-align: center; font-size:7; margin: 0; font-weight:bold">
        Nota: Este documento NO ampara la Licencia de Funcionamiento
      </P>  
      <br>
    </td>
  </tr>
  
<tr>
    <td colspan="4" style="font-weight:bold; border-top: 1px dashed;text-align:center;border-right:none;border-left:none;border-bottom:none">
      <p style = "text-align: center ; font-size:10; margin: 0; line-height: bold ">
          CONTRA-RECIBO
      </p>
      <p style = "text-align: center ; font-size:10; margin: 0; line-height: normal ">
        Solicitud de Licencia de Funcionamiento SARE
      </p>
      <br>
    </td>
  </tr>

  <tr>
    <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      NOMBRE O RAZÓN SOCIAL:
    </td>

    <td colspan="3" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">     
        {{ isset($datospdf->apellido1_sol)?$datospdf->apellido1_sol:'' }} 
        {{ isset($datospdf->apellido2_sol)?$datospdf->apellido2_sol:'' }}  
        {{ isset($datospdf->nombre_sol)?$datospdf->nombre_sol:'' }}   
      </div>  
    </td>

  </tr>

  <tr >

    <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      FECHA DE ENTREGA:
    </td>
    <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">     
        {{ isset($fechact)?$fechact:'' }}
      </div>  
    </td> 
    <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      FOLIO:
    </td>
    <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      <div style="background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">     
        {{ isset($datospdf->folio)?$datospdf->folio:'' }}
      </div>  
    </td>

  </tr>
      
  <tr>
    <td colspan="4" style = "border:none">
        <p style = "text-align: center; font-size:8; margin: 0; line-height: normal">
          VENTANILLA DEL SISTEMA DE APERTURA RÁPIDA DE EMPRESAS <br>
          LUNES-VIERNES de 8:00 - 15:00 hrs. TEL. 123-79-00 EXT.2401 <br>
        </p>
        <p style = "text-align: center; font-size:7; margin: 0; line-height: normal">  
          Lunes a Viernes 8:00 - 15:00 hrs. Blvd. Luis Donaldo Colosio E/ Carabineros y Av. De los Deportistas
        </p>
    </td>
  </tr>

  </tbody>  

</table>

<!-- hoja 2 -->

<div style="page-break-after:always;"></div>

<table style = "border:none">

<tr>
  <td width="15%" style="border:none">
  </td>

  <td width="20%" style="border:none">
    <hr style="text-align:rigth; height:2px;border-width:0;color:gray;background-color:gray"> 
  </td>

  <td width="30%" style="text-align:center; font-size:9; font-weight: bold; margin: 0;border:none">
  ANUNCIO PUBLICITARIO
  </td>

  <td width="20%" style="border:none">
    <hr style="text-align:left; height:2px;border-width:0;color:gray;background-color:gray"> 
  </td>

  <td width="15%" style="border:none">
  </td>
</tr>

</table>

<br>

<table style = "border:none">
    <thead>
      <tr style ="display:none">
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>

  <tbody>

  <tr>
        <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
          PINTADO Y MURAL
        </td>

        <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            @if($solicitudesr->tipoanuncion == "PINTADO/MURAL")           
              X  
                @else
                  <p> </p>
            @endif  
          </div>          
        </td>

      <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        ESTRUCTURAL
      </td>

      <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          @if($solicitudesr->tipoanuncion == "ESTRUCTURAL")           
                X
                @else
                  <p> </p>
          @endif 
          </div>                    
       </td>

      <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        LUMINOSO
      </td>
        
      <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
         <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            @if($solicitudesr->tipoanuncion == "LUMINOSO")         
              X  
               @else
                  <p> </p>
            @endif 
          </div>             
       </td>

      <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        OTROS
      </td>

      <td style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          @if($solicitudesr->tipoanuncion == "OTRO")           
            X  
               @else
                  <p> </p>
            @endif 
          </div>       
      </td>

  </tr>

  <tr>
      <td colspan="8" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        LEYENDA DEL ANUNCIO
      </td>
  </tr>

  <tr>
      <td colspan="8" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($solicitudesr->leyendaa)?$solicitudesr->leyendaa:'' }}
        </div>
      </td>
  </tr>

  </tbody>
</table>
<br>
<table style = "border:none">

  <tr>
      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        LUGAR DE INSTALACIÓN DEL ANUNCIO
      </td>

      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($solicitudesr->lugarinstalacion)?$solicitudesr->lugarinstalacion:'' }}  
        </div>  
      </td>

      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        LARGO
      </td>
      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($solicitudesr->largo_letrero)?$solicitudesr->largo_letrero:'' }}
        </div>  
      </td>
      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
        Mts.
      </td>
      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        ANCHO
      </td>
      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          {{ isset($solicitudesr->ancho_letrero)?$solicitudesr->ancho_letrero:'' }}
        </div>  
      </td>

      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        Mts.
      </td>

  </tr>
</table>

<table style = "border:none">

  <tr>
    <td colspan="3" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      <br>
      Bajo protesta de decir la verdad declaro que los datos aquì presentados son verdaderos y que cualquier falsedad
      u omisión de los mismos, será causa de la revocación de la licencia de funcionamiento. Lo anterior, sin prejuicio 
      de las sanciones en que puede incurrir.
      <br><br><br>
    </td>
  </tr>

  <tr>
   
    <td colspan="1" style="border:none">
    </td>

    <td colspan="1" style="text-align:center; font-size:9; font-weight: bold; margin: 0;border:none">
      <hr style="text-align:left; height:1px;border-width:0;color:black;background-color:black"> 
    </td>

    <td colspan="1" style="border:none">
    </td>

  </tr>

  <tr>
 
    <td colspan="1" style="border:none">
    </td>

    <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      NOMBRE Y FIRMA DE QUIEN SOLICITA EL TRÁMITE
      <br><br>
    </td>

    <td colspan="1" style="border:none">
    </td>

  </tr>

</table>


<table style = "border:none">

<tr>
  <td width="15%" style="border:none">
  </td>

  <td width="20%" style="border:none">
    <hr style="text-align:rigth; height:2px;border-width:0;color:gray;background-color:gray"> 
  </td>

  <td width="30%" style="text-align:center; font-size:9; font-weight: bold; margin: 0;border:none">
    CROQUIS DE LOCALIZACIÓN
  </td>

  <td width="20%" style="border:none">
    <hr style="text-align:left; height:2px;border-width:0;color:gray;background-color:gray"> 
  </td>

  <td width="15%" style="border:none">
  </td>
</tr>

</table>

<table style = "border:none">

  <tr>
    <td colspan="8" style="height:200px; text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">   
        <br><br><br><br><br><br><br><br><br>
        <img src="{{ asset('imagenes/nortenuevo1.png')}}" width="60" height="60" style="float: left"> 
        <br><br><br><br>
      </div>      
    </td>
  </tr>

</table>

<br>

<table style = "border:none">

  <tr>
    <td width="20%" style="border:none">
    </td>

    <td width="20%" style="border:none">
      <hr style="text-align:rigth; height:2px;border-width:0;color:gray;background-color:gray"> 
    </td>

    <td width="20%" style="text-align:center; font-size:9; font-weight: bold; margin: 0;border:none">
    DATOS ESTADISTICOS
    </td>

    <td width="20%" style="border:none">
      <hr style="text-align:left; height:2px;border-width:0;color:gray;background-color:gray"> 
    </td>

    <td width="20%" style="border:none">
    </td>
  </tr>

</table>

<table style = "border:none">
   
    <tr>

      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        SECTOR: INDUSTRIAL
      </td>

      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            @if($solicitudesr->uso == "BODEGA/INDUSTRIA")           
                X  
                @else
                <p> </p>
            @endif        
          </div>  
        </td> 

      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        COMERCIAL
      </td>

      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            @if($solicitudesr->uso == "COMERCIO")           
                X  
                @else
                <p> </p>
            @endif        
          </div>  
        </td> 

      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        SERVICIOS
      </td>

      <td width="8.33%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
            @if($solicitudesr->uso == "SERVICIO")           
                X  
                @else
                <p> </p>
            @endif        
          </div>  
        </td> 

      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        TOTAL DE INVERSION REQUERIDA
      </td>
      
      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none"> 
          <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
              @if(isset($datospdf->capital))    
                {{$datospdf->capital}}        
                  @else
                    <p></p>
              @endif
            </div>  
        </td> 

    </tr>
</table>

<table style = "border:none">

    <tr>

      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        FECHA DE INICIO DE OPERACIONES DEL ESTABLECIMIENTO
      </td>
      <td width="25%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
        @if(isset($datospdf->inop_e))    
                {{$datospdf->inop_e}}        
                  @else
                    <p></p>
              @endif
        </div>  
      </td>

      <td width="12.5%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        NÚM. DE EMPLEADOS: HOMBRES
      </td>  
      
      <td width="12.5%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">  
          @if(isset($solicitudesr->hombres))    
                  {{$solicitudesr->hombres}}        
                    @else
                      <p></p>
                @endif  
        </div>  
      </td>
      <td width="12.5%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        MUEJERES
      </td>
      <td width="12.5%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px"> 
            @if(isset($solicitudesr->mujeres))    
                      {{$solicitudesr->mujeres}}        
                        @else
                          <p></p>
                    @endif     
        </div>  
      </td>

    </tr> 

</table>  

<table style = "border:none">
    <tr>

      <td colspan="5" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        ¿EMPLEA PERSONAS CON CAPACIDADES DIFERENTES?:
      </td>
      <td colspan="5" style = "text-align:center; font-size:6; font-weight: bold; margin: 0; border:none">
        Nota: La información proporcionada será utilizada exclusivamente para efectos estadísticos
      </td>
    
    </tr>  
      
    <tr>
      <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        SI
      </td>

      <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          @if($solicitudesr->capacidades == "1")         
            X
              @else
                <p></p>
          @endif     
        </div>  
      </td>

      <td colspan="1" style="border:none"></td>

      <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        NO
      </td>

      <td colspan="1" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">    
          @if($solicitudesr->capacidades == "2")         
            X
              @else
                <p></p>
          @endif     
        </div>  
      </td>

      <td colspan="5" style="border:none"></td>
    </tr>

</table>
<br>
<table style = "border:none">

  <tr>
    <td width="15%" style="border:none">
    </td>

    <td width="20%" style="border:none">
      <hr style="text-align:rigth; height:2px;border-width:0;color:gray;background-color:gray"> 
    </td>

    <td width="30%" style="text-align:center; font-size:9; font-weight: bold; margin: 0;border:none">
      OBSERVACIONES Y CONDICIONES
    </td>

    <td width="20%" style="border:none">
      <hr style="text-align:left; height:2px;border-width:0;color:gray;background-color:gray"> 
    </td>

    <td width="15%" style="border:none">
    </td>
  </tr>

</table>


<table style = "border:none">

  <tr>
    <td colspan="8" style="height:150px; text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
      <div style=" background-color: #f8f8f8; border: 1px solid; border-radius: 10px 10px 10px 10px">   
        <br><br><br><br><br><br><br><br><br>
      </div>      
    </td>
  </tr>
  
</table>

<table style = "border:none">

  <tr>
    <td width="60%" style = "text-align:center; font-size:7; font-weight: bold; margin: 0; border:none">
        ¡CUALQUIER ANOMALÍA O INTENTO DE EXTORSIÓN REPORTARLO, NO TE DEJES SORPRENDER!
        <br>
        https://lapaz.gob.mx/quejas-y-denuncias
    </td>
    <td width="40%" style="border:none">
      <p style="font-weight:bold; font-size:9;text-align:right;text-decoration: underline">
      ESTE TRÁMITE ES TOTALMENTE GRATUITO
      </p>  
    
    </td>
  </tr>

</table>

</body>
</html>


<script>
window.onload = iniciafecha;

function iniciafecha()
{
    
    document.getElementById("txtfecha").valueAsDate = new Date();
    
}
</script>