
@extends('layouts.app')

@section('content')

<form action= "{{ url('/padron/'.$contribuyente->id_puc) }}" method="post">


  @csrf
  {{ method_field('PATCH')}}

  <div class="container">
      <h3 >Agregar Ubicación del contribuyente</h3>

      <div class="container p-3 my-3 border">
            
        <div class="form-group row">
          
          <div class="form-group col-md-4">
              <label>Tipo de persona</label>
              <fieldset id="grupopersona">
        
              @if($contribuyente->tipo_persona == "FISICA")         
                <input type="radio" id ="optpersonafisica" name="optpersona" value="1" checked> Fisica
                <input type="radio" id="optpersonamoral" name="optpersona" value="2"> Moral
                <input type="radio" id="optpersonagenerica" name="optpersona" value="3"> Generica
              @endif
              
              @if($contribuyente->tipo_persona == "MORAL")               
                <input type="radio" id ="optpersonafisica" name="optpersona" value="1"> Fisica
                <input type="radio" id="optpersonamoral" name="optpersona" value="2" checked> Moral
                <input type="radio" id="optpersonagenerica" name="optpersona" value="3"> Generica
              @endif

              @if($contribuyente->tipo_persona == "GENERICA")               
                <input type="radio" id ="optpersonafisica" name="optpersona" value="1"> Fisica
                <input type="radio" id="optpersonamoral" name="optpersona" value="2"> Moral
                <input type="radio" id="optpersonagenerica" name="optpersona" value="3" checked> Generica
              @endif

          
              </fieldset>
          </div>

          <div class="form-group col-md-4">
            <label>Registrado SAT</label>
            <fieldset id="gruposat">
            @if($contribuyente->registrado_sat == "S")         
                <input type="radio" id ="optsatsi" name="optsat" value="1" checked> Si
                <input type="radio" id="optsatno" name="optsat" value="2"> No
                @else
                  <input type="radio" id ="optsatsi" name="optsat" value="1"> Si
                  <input type="radio" id="optsatno" name="optsat" value="2" checked> No
            @endif      
            </fieldset>
          </div>

          <div class="form-group col-md-4">
            <label>Genero</label>
            <fieldset id="grupogenero">
              @if($contribuyente->genero == "H")         
                <input type="radio" id ="opthombre" name="optgenero" value="1" checked> Masculino
                <input type="radio" id="optmujer" name="optgenero" value="2"> Femenino
                @else
                  <input type="radio" id ="opthombre" name="optgenero" value="1"> Masculino
                  <input type="radio" id="optmujer" name="optgenero" value="2" checked> Femenino
              @endif    
            </fieldset>
          </div>

        </div>

            <label>Fecha de nacimiento </label>

            <input type="date" id="txtfecha_naci" name="txtfecha_naci" value="{{ isset($contribuyente->fechanac)?date('Y-m-d',strtotime($contribuyente->fechanac)):date('Y-m-d')}}">
            <br>  
            <br>
            <label>Razon Social</label>
            <input class="form-control" type="text" id="txtrazonsocial" name="txtrazonsocial" value="{{ isset($contribuyente->nombre)?$contribuyente->nombre:'' }}">
            <br>
            <label>Apellido Paterno</label>
            <input class="form-control" type="text" id="txtApellidoPaterno" name="txtApellidoPaterno" value="{{ isset($contribuyente->apellido1)?$contribuyente->apellido1:'' }}">
            <br>
            <label>Apellido Materno</label>
            <input class="form-control" type="text" id="txtApellidoMaterno" name="txtApellidoMaterno" value="{{ isset($contribuyente->apellido2)?$contribuyente->apellido2:'' }}">
            <br>
            

            
            <div class="form-group row">
              <div class="form-group col-md-6">
                  <label>Correo electronico</label>
                  <input class="form-control" type="text" id="txtce" name="txtce" value="{{ isset($contribuyente->correo)?$contribuyente->correo:'' }}">
              </div>
            </div>

            <div class="form-group row">
            
              <div class="form-group col-md-6">
                <label>RFC</label>
                <input class="form-control" type="text" id="txtrfc" name="txtrfc" value="{{ isset($contribuyente->rfc)?$contribuyente->rfc:'' }}">    
              </div>    
              <div class="form-group col-md-6">
                <label>CURP</label>
                <input class="form-control" type="text" id="txtcurp" name="txtcurp" value="{{ isset($contribuyente->curp)?$contribuyente->curp:'' }}">    
              </div>    
              <div class="form-group col-md-6">    
                  <label>Telefono</label>
                  <input class="form-control" type="text" id="txttel" name="txttel" value="{{ isset($contribuyente->telefono)?$contribuyente->telefono:'' }}">
              </div>
              <div class="form-group col-md-6">    
                  <label>Celular</label>
                  <input class="form-control" type="text" id="txtcel" name="txtcel" value="{{ isset($contribuyente->celular)?$contribuyente->celular:'' }}">
              </div>
              <div class="form-group col-md-6">    
                  <label>Nacionalidad</label>
                  <input class="form-control" type="text" id="txtnacionalidad" name="txtnacionalidad" value="{{ isset($contribuyente->nacionalidad)?$contribuyente->nacionalidad:'' }}">
              </div>
              <div class="form-group col-md-6">        
                  <label>Entidad</label>
                  <input class="form-control" type="text" id="txtentidad" name="txtentidad" value="{{ isset($contribuyente->entidad)?$contribuyente->entidad:'' }}">
              </div>    
            
            </div>

            <label>Representante</label>
            <input class="form-control" type="text" id="txtrepresentante" name="txtrepresentante" value="{{ isset($contribuyente->representante)?$contribuyente->representante:'' }}">
            <br>
            <button type="submit" onclick="return confirm('Desea actualizar la ubicacion?')" class="btn btn-primary" >
              ACTUALIZA
            </button>  

            <a class="btn btn-info" href="{{ url('/padron') }}" role="button">
              REGRESA
            </a>  


      </div>
      
  </div>    
 


</form>

@endsection 



