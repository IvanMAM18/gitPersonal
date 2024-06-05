
@extends('layouts.app')

@section('content')

<form action= "{{ url('/padron') }}" method="post" id="Guardaalta">

  @csrf
    <div class="container">
      <h3 >Agregar nuevo contribuyente</h3>
      <div class="container p-3 my-3 border">
            
          <div class="form-group row">
            
            <div class="form-group col-md-4">
                <label>Tipo de persona</label>
                <fieldset id="grupopersona">
                  <input type="radio" id ="optpersonafisica" name="optpersona" value="1" checked> Fisica
                  <input type="radio" id="optpersonamoral" name="optpersona" value="2"> Moral
                  <input type="radio" id="optpersonagenerica" name="optpersona" value="3"> Generica
                </fieldset>
            </div>

            <div class="form-group col-md-4">
              <label>Registrado SAT</label>
              <fieldset id="gruposat">
                <input type="radio" id ="optsatsi" name="optsat" value="1" checked> Si
                <input type="radio" id="optsatno" name="optsat" value="2"> No
              </fieldset>
            </div>

            <div class="form-group col-md-4">
              <label>Genero</label>
              <fieldset id="grupogenero">
                <input type="radio" id ="opthombre" name="optgenero" value="1" checked> Masculino
                <input type="radio" id="optmujer" name="optgenero" value="2"> Femenino
              </fieldset>
            </div>

          </div>

              <label>Fecha de nacimiento </label>
              <input type="date" id="txtfecha_naci" name="txtfecha_naci">
              <br>  
              <br>
              <label>Razon Social</label>
              <input class="form-control" type="text" id="txtrazonsocial" name="txtrazonsocial">
              <br>
              <label>Apellido Paterno</label>
              <input class="form-control" type="text" id="txtApellidoPaterno" name="txtApellidoPaterno">
              <br>
              <label>Apellido Materno</label>
              <input class="form-control" type="text" id="txtApellidoMaterno" name="txtApellidoMaterno">
              <br>
              

              
              <div class="form-group row">
                <div class="form-group col-md-6">
                    <label>Correo electronico</label>
                    <input class="form-control" type="text" id="txtce" name="txtce">
                </div>
              </div>

              <div class="form-group row">
              
                <div class="form-group col-md-6">
                  <label>RFC</label>
                  <input class="form-control" type="text" id="txtrfc" name="txtrfc">    
                </div>    
                <div class="form-group col-md-6">
                  <label>CURP</label>
                  <input class="form-control" type="text" id="txtcurp" name="txtcurp">    
                </div>    
                <div class="form-group col-md-6">    
                    <label>Telefono</label>
                    <input class="form-control" type="text" id="txttel" name="txttel">
                </div>
                <div class="form-group col-md-6">    
                    <label>Celular</label>
                    <input class="form-control" type="text" id="txtcel" name="txtcel">
                </div>
                <div class="form-group col-md-6">    
                    <label>Nacionalidad</label>
                    <input class="form-control" type="text" id="txtnacionalidad" name="txtnacionalidad">
                </div>
                <div class="form-group col-md-6">        
                    <label>Entidad</label>
                    <input class="form-control" type="text" id="txtentidad" name="txtentidad">
                </div>    
              
              </div>

              <label>Representante</label>
              <input class="form-control" type="text" id="txtrepresentante" name="txtrepresentante">
              <br>

              <button class="btn btn-primary" type="submit" form="Guardaalta" onclick="return confirm('Desea Agregar un Nuevo Contribuyente?')">
                GRABA NUEVO CONTRIBUYENTE
              </button> 
            
              <a class="btn btn-info" href="{{ url('/solicitudes/create') }}" role="button">
                REGRESA
            </a>
            
        </div>

    </div>


</form>

 <table id ="tablacontribuyentes" class="table table-bordered table-hover">
    <thead class="thead-light">
        <tr>
        <th>ID</th>
        <th>RFC</th>
        <th>CURP</th>
        <th>NOMBRE</th>
        <th>PATERNO</th>
        <th>MATERNO</th>
        <th>ACCIÓN</th>
        </tr>
    </thead>
    <tbody>
    @foreach($listas as $lista)
        <tr>
            <td>{{$lista->id_puc}}</td>
            <td>{{$lista->rfc}}</td>
            <td>{{$lista->curp}}</td>
            <td>{{$lista->nombre}}</td>
            <td>{{$lista->apellido1}}</td>
            <td>{{$lista->apellido2}}</td>
            <td>
              <a href="{{ url('/padron/'.$lista->id_puc.'/edit') }}">
                      Editar
              </a>
              |
              <a href="{{ url('/ubicacion/'.$lista->id_puc) }}">
                      Agregar Ubicacion
              </a>
              |
              <form action="{{ url('/padron/'.$lista->id_puc) }}" method="post">
                  @csrf
                  {{ method_field('DELETE') }}
                  <input type="submit" onclick="return confirm('Quieres Borrar?')" value="Borrar">
              </form>
            </td>

        </tr>
    @endforeach    
    </tbody>
    
</table>

{{$listas->links()}}


@endsection 





