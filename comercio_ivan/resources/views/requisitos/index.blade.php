@extends('layouts.app')

@section('content')

<div class="container">

    <br><br>        

    <form action= "{{ url('requisitos') }}" method="post" id="altarequisito">
    @csrf

        <div class="form-group row">

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


            <div class="form-group col-md-2"></div>
            <div class="form-group col-md-8">
                <label style = "text-align: center">Nombre del Requsito</label>
                <input type="hidden" id="idrequisito" name="idrequisito">
                <input class="form-control" type="text" id="txtrequisito" name="txtrequisito">
                <br>
                <button id="guarda_solicitud" onclick="return confirm('Quieres Guardar el Requisito?')" class="btn btn-primary" type="submit" form="altarequisito">
                    Guardar Requisitos
                </button>  
            </div>    
            <div class="form-group col-md-2"></div>
        </div>
    </form>   


    <div class="form-group row">

        <div class="form-group col-md-6">

            @if (auth()->user()->sare == 1)
            <h3 style = "text-align: center">REQUISITOS SARE</h3>
            @endif    

            @if (auth()->user()->civil == 1)
            <h3 style = "text-align: center">REQUISITOS DE PROTECCIÓN CIVIL</h3>
            @endif    

            @if (auth()->user()->ordenamiento == 1)
            <h3 style = "text-align: center; font-size:15">REQUISITOS DE DIRECCION DE ASENTAMIENTOS HUMANOS</h3>
            @endif    

            @if (auth()->user()->ecologia == 1)
            <h3 style = "text-align: center; font-size:15">REQUISITOS DE DIRECCION DE MEDIO AMBIENTE</h3>
            @endif    

            <table class="table table-light">
                <thead class="thead-light">
                    <tr>
                        <th style = "display:none">ID</th>
                        <th>ID</th>
                        <th>REQUISITO</th>
                        <th>ACCION</th>
                    </tr>
                </thead>
                <tbody>

                @foreach($datosrequisitos as $requisito)

                    <tr>
                        <td>{{$requisito->requisito_id}}</td>
                        <td>{{$requisito->nombre}}</td>
                        <td>
                            <form action="{{ url('requisitos/'.$requisito->id) }}" method="post" id="borrarequisito">
                                @csrf
                                {{ method_field('DELETE') }}
                                <input class="btn btn-danger" type="submit" onclick="return confirm('Quieres Borrar El Requisito?')" value="Borrar" id="borrarequisito">
                            </form>
                        </td>
                    </tr>
                    
                @endforeach  

                </tbody>
                
            </table>
        </div>
    

        <div class="form-group col-md-6">
            
        <h3 style = "text-align: center">REQUSITOS GLOBALES</h3>

                <table id ="glabales" class="table table-light">

                    <thead class="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>REQUISITO</th>
                            <th>DESCRIPCION</th>
                        </tr>
                    </thead>
                    <tbody>

                    @foreach($globales_requisitos as $glorequisito)

                        <tr ondblclick="seleccionaTe(this)">

                            <td>{{$glorequisito->id}}</td>
                            <td>{{$glorequisito->nombre}}</td>
                            <td>{{$glorequisito->descripcion}}</td>
                        
                        </tr>
                        
                    @endforeach  

                    </tbody>
                    
                </table>
        </div>

    </div>        

</div>
@endsection 

<script>

function seleccionaTe(x) 
{
  
  var table = document.getElementById("glabales");
  
  document.getElementById('idrequisito').value=table.rows[x.rowIndex].cells[0].innerHTML;
  document.getElementById('txtrequisito').value=table.rows[x.rowIndex].cells[1].innerHTML;


}

</script>


