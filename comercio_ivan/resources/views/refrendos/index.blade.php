@extends('layouts.app')

@section('content')
<div class="container">

    <h3 style="text-align:center">REGISTRO DE REFRENDOS</h3>      
    <br>

    <ul>
        <li><a class="active" href="{{ url('solicitudes') }}">REGISTRO DE APERTURA</a></li>
        
        @if (auth()->user()->sare == 1)
            <li><a href="{{ url('refrendos') }}">REGISTRO DE REFRENDOS</a></li>
        @endif

        @if (auth()->user()->ecologia == 1)
            <li><a href="{{ url('refrendoseco') }}">REGISTRO DE REFRENDOS</a></li>
        @endif

        <li><a href="">CATALOGO DE GIROS</a></li>
    </ul>

    <div class="form-group row">

        <div class="input-group col-md-6">
            
            <form action= "{{ url('solicitudes/busca') }}" method="get" id="BuscaPorFolio">

                <input type="search" id="txtBuscaFolio" name="txtBuscaFolio" class="form-control" placeholder="Busca por folio">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="submit" id="BuscaPorFolio" >
                        Busca
                    </button>
                </div>

            </form>    

        </div>


    </div>  

    <br><br>

    <table class="table table-light">
        <thead class="thead-light">
            <tr>
                <th>FOLIO</th>
                <th>NOMBRE</th>
                <th>APELLIDO</th>
                <th>TIPO NEGOCIO</th>
                <th>FECHA</th>
                <th>AUTORIZADO ECOLOGIA</th>
                <th>ACCION</th>
            </tr>
        </thead>
        <tbody>
        @foreach($solicitudes as $solicitud)
            <tr>
                <td>{{$solicitud->folio}}</td>
                <td>{{$solicitud->nombre_sol}}</td>
                <td>{{$solicitud->apellido1_sol}}</td>
                <td>{{$solicitud->tipnegocio}}</td>
                <td>{{$solicitud->fecha}}</td>
                
                @if($solicitud->id_tramite == "3")  

                    @if($solicitud->ecologia != "")  
                        
                        @if($solicitud->ecologia == "1")
                            <td>SI</td>
                        @endif    

                        @if($solicitud->ecologia == "2")
                            <td>NO</td>
                        @endif 

                            @else
                            <td>EN ESPERA</td>    
                    @endif
                    @else
                            <td>NO APLICA</td>       
                @endif

                <td>
                    <a href="{{ url('/refrendos/'.$solicitud->folio.'/edit') }}" id="abrerefrendo">
                        editar
                    </a>
                    
                        
                    @if($solicitud->id_tramite == 3)
                        
                        @if($solicitud->ecologia == "1")
                        |
                            <a href="{{ url('/refrendo/'.$solicitud->folio) }}" id="imprimelicencia">
                                licencia funcionamiento
                            </a>                       
                        |        
                        @endif 

                        @else
                        |
                            <a href="{{ url('/refrendo/'.$solicitud->folio) }}" id="imprimelicencia">
                                licencia funcionamiento
                            </a>                       
                        |                        
                    @endif    
                   
                    <form action="{{ url('/solicitudes/'.$solicitud->folio) }}" method="post" id="sareborra">
                        @csrf
                        {{ method_field('DELETE') }}
                        <input type="submit" onclick="return confirm('Quieres Borrar?')" value="Borrar" id="sareborra">
                    </form>
                   
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



