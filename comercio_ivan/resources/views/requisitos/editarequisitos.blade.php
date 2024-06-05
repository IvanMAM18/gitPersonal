@extends('layouts.app')

@section('content')

<div class="container">

<form action= "{{ url('/requisitos_globales/'.$datos->id) }}" method="post" id="ActualizarRequisitos">
    @csrf
    
    {{ method_field('PATCH') }}

    <h3>Editar Requisitos</h3>

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

    <label>Nombre del requisito</label>
    <input class="form-control" 
            type="text" id="txtnombrerequisito" 
            name="txtnombrerequisito" 
            value="{{isset($datos->nombre)?$datos->nombre:''}}">

    <label>Descripcion del requisito</label>
    <input class="form-control" 
            type="text" id="txtdescripcionrequisito" 
            name="txtdescripcionrequisito" 
            value="{{isset($datos->descripcion)?$datos->descripcion:''}}">        
    <br>
    

    <div class="container p-3 my-3 border">
        <button class="btn btn-primary" onclick="return confirm('Desea actualizar la información?')" type="submit" form="ActualizarRequisitos" >
            Actualizar
        </button>  
    </div>   

</form>    

</div>

@endsection   
