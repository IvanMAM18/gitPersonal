@extends('layouts.app')

@section('content')

<div class="container">

@if (auth()->user()->civil == 1)
    <h3 style = "text-align: center">INSPECCIÓN DE PROTECCIÓN CIVIL</h3>
@endif    

@if (auth()->user()->ordenamiento == 1)
    <h3 style = "text-align: center; font-size:15">AUTORIZACIÓN DE DIRECCION DE ASENTAMIENTOS HUMANOS</h3>
@endif    

@if (auth()->user()->ecologia == 1)
    <h3 style = "text-align: center; font-size:15">AUTORIZACIÓN DE DIRECCION DE MEDIO AMBIENTE</h3>
@endif    

<br>

<ul>
        <li><a class="active" href="{{ url('solicitudes') }}">REGISTRO DE APERTURA</a></li>
        
        @if (auth()->user()->sare == 1)   
            <li><a href="{{ url('refrendos') }}">REGISTRO DE REFRENDOS</a></li>
        @endif    
        
        @if (auth()->user()->ecologia == 1)   
            <li><a href="{{ url('refrendoseco') }}">REGISTRO DE REFRENDOS</a></li>
            proteccion
        @endif    
        
        <li><a href="">CATALOGO DE GIROS</a></li>
    </ul>

    <table class="table table-light">
        <thead class="thead-light">
            <tr>
                <th>ID</th>
                <th>FOLIO</th>
                <th>NOMBRE</th>
                <th>APELLIDO</th>
                <th>TIPO NEGOCIO</th>
                <th>FECHA</th>

                @if (auth()->user()->civil == 1) 
                    <th>INSPECCIONADO</th>
                @endif 
                @if (auth()->user()->ordenamiento == 1 or auth()->user()->ecologia == 1)
                    <th>VERIFICADO</th>
                @endif 

                <th>ACCION</th>
                <th>PDF</th>
                <th>MOSTRAR</th>
            </tr>
        </thead>
        <tbody>

        @foreach($solicitudes as $solicitud)

            <tr>
                <td>{{$solicitud->valida}}</td>
                <td>{{$solicitud->folio}}</td>
                <td>{{$solicitud->nombre_sol}}</td>
                <td>{{$solicitud->apellido1_sol}}</td>
                <td>{{$solicitud->tipnegocio}}</td>
                <td>{{$solicitud->fecha}}</td>
         
                @if($solicitud->acepto != "")  
                    
                    @if($solicitud->acepto == "1")
                        <td>SI</td>
                    @endif    

                    @if($solicitud->acepto == "2")
                        <td>NO</td>
                    @endif  

                    @else
                    <td></td>
                @endif       
        
                <td>
                @if($solicitud->acepto == "") 
                    <a class="btn btn-info" href="{{  url('/proteccion/'.$solicitud->folio) }}" id="a">
                        @if (auth()->user()->civil == 1) 
                            INSPECCIONAR
                        @endif 
                        @if (auth()->user()->ordenamiento == 1 or auth()->user()->ecologia == 1)
                            VERIFICAR
                        @endif      
                    </a>
                @endif    
            
                @if($solicitud->acepto != "")     
                    <a class="btn btn-primary" href="{{ url('/proteccion/'.$solicitud->valida.'/edit')  }}" id="b">
                    @if (auth()->user()->civil == 1) 
                       MODIFICA INSPECCION
                    @endif
                    @if (auth()->user()->ordenamiento == 1 or auth()->user()->ecologia == 1)
                        MODIFICA VERIFICACION
                    @endif         
                    </a>
                @endif    

                </td>

                <td>
                    @if($solicitud->ruta != "")     
                        <a href="{{  url('storage/'. $solicitud->ruta) }}">
                             PDF 
                        </a>
                    @endif  
                </td>

                <td>
                    <a href="{{ url('/proteccion/mostrar/'.$solicitud->folio) }}" id="sareedicion">
                        MOSTRAR
                    </a>
                </td>    

            </tr>
            
        @endforeach   
        
        
        </tbody>
        
    </table>

    <div class="d-flex justify-content-center">
        {{ $solicitudes->links() }}
    </div>
    

    </div>
@endsection 



