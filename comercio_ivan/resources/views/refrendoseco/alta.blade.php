@extends('layouts.app')

@section('content')



<form action= "{{ url('/refrendoseco/') }}" method="post" id="grabaproah" enctype="multipart/form-data">
    @csrf

<div class="container">

@if(count($errors)>0)
      <div class="alert alert-danger" role="alert">
        <ul>
          @foreach($errors->all() as $error)
          <li>
            {{$error}}
          </li>
          @endforeach
        </ul>
      </div>
    @endif


<input id="txtfolio" name="txtfolio" value="{{ isset($datos)?$datos:'' }}"> 
      <div class="container p-3 my-3 border" style = "text-align: center">
            
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

            <P style = "font-size:15">
                  El archivo a subir debe estar en formato JPG o PNG <br>
                  y pesar como máximo 2 Mega Bytes<br><br>

                  Solicitud por Escrito<br>	
                  Copia de Indetificación Oficial del solicitante	<br>
                  Croquis de Localización	<br>
                  Anuencia por parte del propietario	<br>
                  Copia de Indetificación Oficial de la persona que otorga la anuencia CURP<br>
                  Comprobante de Domicilio<br>
                  Comprobante de Pago Inspección Civil<br>
                  Comprobante de Pago de Licencia
            </P>
            
            <label>SELECCIONE ARCHIVO</label>
            <input type="file" id="archivo" name="archivo">
            <br><br>            
            <label>AUTORIZADO</label>
            <input type="radio" id="optsicivil" name="optcivil" value="1" checked> SI
            <input type="radio" id="optnocivil" name="optcivil" value="2"> NO

            <br><br>
            <label>OBSERVACIÓN</label> 
            <input class="form-control" type="text" id="txtObservacion" name="txtObservacion"> 

            <br>

            <button class="btn btn-primary" type="submit" form="grabaproah" id="grabaproah">
                  GUARDAR
            </button>
            
            <a class="btn btn-info" href="{{ url('/') }}" role="button">
                  REGRESA
            </a>  
      
      </div>    

</div>


</form>

@endsection 