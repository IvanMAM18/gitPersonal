@extends('layouts.app')

@section('content')

<form action= "{{ url('/refrendoseco/'.$datos[0]->id_validar) }}" method="post" id="actproah" enctype="multipart/form-data">
    @csrf
    
    {{ method_field('PATCH') }}


<div class="container" style = "text-align: center">

<input id="txtfolio" name="txtfolio" value="{{ isset($datos[0]->folio)?$datos[0]->folio:'' }}"> 

<div class="container p-3 my-3 border">
      
            @if (auth()->user()->civil == 1)
                  <h3>
                        Validar Solicitud (Planeacion y Regulazion Urbana)<br>
                        Area que valida: PROTECCION CIVIL
                  </h3>
            @endif    

            @if (auth()->user()->ordenamiento == 1)
                  <h3>
                        Validar Solicitud (Planeacion y Regulazion Urbana)<br>
                        Area que Valida: DIRECCION DE ASENTAMIENTOS HUMANOS
                  </h3>
            @endif  

            @if (auth()->user()->ecologia == 1)
                  <h3>
                        Validar Solicitud (Direccion de medio ambiente)<br>
                        Area que Valida: ECOLOGIA
                  </h3>
            @endif

      <br>

      <P>
            El archivo a subir debe estar en formato JPG o PNG <br>
            y pesar como máximo 2 Mega Bytes <br>

            Solicitud por Escrito<br>	
            Copia de Indetificación Oficial del solicitante	<br>
            Croquis de Localización	<br>
            Anuencia por parte del propietario	<br>
            Copia de Indetificación Oficial de la persona que otorga la anuencia CURP<br>
            Comprobante de Domicilio<br>
            Comprobante de Pago Inspección Civil<br>
            Comprobante de Pago de Licencia
      </P>
      
      @if($datos[0]->ruta != "")     
            <P>
                <u>  EXISTE UN ARCHIVO CARGADO </u>
            </P>      

            <a href="{{  url('storage/'. $datos[0]->ruta) }}">
                  PDF 
            </a>

      @endif 
      <input type="text" id="txtarchivocargado" name="txtarchivocargado" value="{{ isset($datos[0]->ruta )?$datos[0]->ruta :'' }}">
      <br>
      <br>
      <input type="file" id="archivo_pdf" name="archivo_pdf">     
      
      <br><br>            

      <label>AUTORIZADO</label>
      @if( $datos != null )   
            @if($datos[0]->aceptado == 1)           
                  
                  <input type="radio" id="optsicivil" name="optcivil" value="1" checked> SI
                  <input type="radio" id="optnocivil" name="optcivil" value="2"> NO
                  
                        @else   
                              <input type="radio" id="optsicivil" name="optcivil" value="1"> SI
                              <input type="radio" id="optnocivil" name="optcivil" value="2" checked> NO
                              
            @endif
      

            @else
            <input type="radio" id="optsicivil" name="optcivil" value="1"> SI
            <input type="radio" id="optnocivil" name="optcivil" value="2"> NO

      @endif

      <br><br>   
      <label>Observacion</label> 
      <br>
      <input class="form-control" type="text" id="txtObservacion" name="txtObservacion" value="{{ isset($datos[0]->observacion )?$datos[0]->observacion :'' }}"> 
      <br>
      <button class="btn btn-primary" type="submit" form="actproah" id="actproah">
            GUARDAR
      </button> 

      <a class="btn btn-info" href="{{ url('/') }}" role="button">
            REGRESA
      </a>  

</div>    

</div>


</form>

@endsection 