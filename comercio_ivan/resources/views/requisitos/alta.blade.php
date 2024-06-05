@extends('layouts.app')

@section('content')

<div class="container">

<h3 style = "text-align: center">REQUSITOS GLOBALES</h3>

<form action= "{{ url('requisitos_globales') }}" method="post" id="altarequisito_global">
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
            <label style = "text-align: center">Nombre del requsito</label>
            <input class="form-control" type="text" id="txtrequisito" name="txtrequisito">
            <label style = "text-align: center">Nombre de la descripción</label>
            <input class="form-control" type="text" id="txtdescripcion" name="txtdescripcion">
            <br>
            <button id="guarda_solicitud" onclick="return confirm('Quieres Guardar el Requisito?')" class="btn btn-primary" type="submit" form="altarequisito_global">
                Guardar Requisitos
            </button>  
        </div>    
        <div class="form-group col-md-2"></div>
    </div>
</form>   


    
            
        

                <table id ="glabales" class="table table-light">

                    <thead class="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>REQUISITO</th>
                            <th>DESCRIPCION</th>
                            <th>ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>

                    @foreach($globales_requisitos as $globales)

                        <tr ondblclick="seleccionaTe(this)">

                            <td>{{$globales->id}}</td>
                            <td>{{$globales->nombre}}</td>
                            <td>{{$globales->descripcion}}</td>
                            <td>
                                <a class="btn btn-primary" href="{{ url('/requisitos_globales/'.$globales->id.'/edit')  }}" id="editarquisito"> 
                                    Editar
                                </a>
                                <form action="{{ url('requisitos_globales/'.$globales->id) }}" method="post" id="borrarequisito1">
                                    @csrf
                                    {{ method_field('DELETE') }}
                                    <input class="btn btn-danger" type="submit" onclick="return confirm('Quieres Borrar El Requisito?')" value="Borrar" id="borrarequisito1">
                                </form>
                        </td>
                        
                        </tr>
                        
                    @endforeach  

                    </tbody>
                    
                </table>

                <div class="d-flex justify-content-center">
                    {{ $globales_requisitos->links() }}
                </div>         
        
</div>
    

@endsection 