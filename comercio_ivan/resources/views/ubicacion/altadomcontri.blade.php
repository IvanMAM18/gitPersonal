

@extends('layouts.app')

@section('content')

<form action= "{{ url('/ubicacion') }}" method="POST" id="Guarubicacion">


    @csrf
    <div class="container">
        <h2>AGREGAR UBICACION CONTRIBUYENTE</h2>
        <input class="form-control" type="hidden" id="txtidpuc" name="txtidpuc" value="{{ isset($contribuyente->id_puc)?$contribuyente->id_puc:'' }}">
        
        <div class="container p-3 my-3 border">
            <fieldset id="agrupapordom">
                  <div class="form-check form-check-inline">
                    <input class="tablinks" onchange="tabusca(event, 'buscanormal')" type="radio" id ="optnormal" name="optdespliubica" value="1" checked> Domicilio del Contribuyente
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="tablinks" onchange="tabusca(event, 'buscaestablecimiento')" type="radio" id="optestablecimiento" name="optdespliubica" value="2"> Domicilio del Establecimiento  
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="tablinks" onchange="tabusca(event, 'buscanotificar')" type="radio" id="optnotificar" name="optdespliubica" value="3"> Domicilio a Notificar            
                  </div>  
                  <div class="form-check form-check-inline">
                    <input class="tablinks" onchange="tabusca(event, 'buscafiscal')" type="radio" id="optfiscal" name="optdespliubica" value="4"> Domicilio Fiscal
                  </div>  
            </fieldset>
          </div>

          <div class="container p-3 my-3 border">

            <div id = "buscanormal" class="tabcontent">
              <h3 >DOMICILIO DEL CONTRIBUYENTE</h3>
              <br>
                  <div class="form-group row">
                  
                    <div class="form-group col-md-6">    
                        <label>Entidad</label>
                        <select class="form-control" name="cbocat_entidades_con" id="cbocat_entidades_con">
                            @foreach($entidades as $entidad)
                              <option value="{{$entidad->clave}}"> {{$entidad->clave}} {{$entidad->nombre}}</option>
                            @endforeach
                        </select >     
                    </div>

                    <div class="form-group col-md-6">    
                        <label>Municipio</label>
                        <input class="form-control" type="text" id="txtmunicipio_con" name="txtmunicipio_con">
                    </div>
                    <div class="form-group col-md-6">    
                        <label>Localidad</label>
                        <input class="form-control" type="text" id="txtlocalidad_con" name="txtlocalidad_con">
                    </div>
                    <div class="form-group col-md-6">        
                        <label>Colonia</label>
                        <input class="form-control" type="text" id="txtcolonia_con" name="txtcolonia_con">
                    </div>    
                  
                  </div>
                  
                  <div class="form-group row">
                    <div class="form-group col-md-4">
                      <label>CP</label>
                      <input class="form-control" type="text" id="txtcp_con" name="txtcp_con">
                    </div>
                    <div class="form-group col-md-4">
                      <label>Clave Catastral</label>
                      <input class="form-control" type="text" id="txtclavecata_con" name="txtclavecata_con">
                    </div>
                  </div>


                  <label>Calle</label>
                  <input class="form-control" type="text" id="txtcalle_con" name="txtcalle_con">
                  <br>
                  <label>Entre</label>
                  <input class="form-control" type="text" id="txtentre_con" name="txtentre_con">
                  <br>

                  <label>Y Entre</label>
                  <input class="form-control" type="text" id="txtyentre_con" name="txtyentre_con">
                  <br>

                  <div class="form-group row">
                    <div class="form-group col-md-6">
                      <label>NO Interior</label>
                      <input class="form-control" type="text" id="txtnoint_con" name="txtnoint_con">    
                    </div>    
                    <div class="form-group col-md-6">
                      <label>NO Exterior</label>
                      <input class="form-control" type="text" id="txtnoext_con" name="txtnoext_con">    
                    </div>    
                  </div>
            </div>
            
            <div id = "buscaestablecimiento" class="tabcontent">
                <h3 >DOMICILIO DEL ESTABLECIMIENTO</h3>
                <br>
                  <div class="form-group row">
                  
                    <div class="form-group col-md-6">    
                        <label>Entidad</label>
                        <select class="form-control" name="cbocat_entidades_esta" id="cbocat_entidades_esta">
                            @foreach($entidades as $entidad)
                            <option value="{{$entidad->clave}}"> {{$entidad->clave}} {{$entidad->nombre}}</option>
                            @endforeach
                        </select >     
                    </div>

                    <div class="form-group col-md-6">    
                        <label>Municipio</label>
                        <select class="form-control" name="cbocat_municipios_esta" id="cbocat_municipios_esta">
                            @foreach($municipios as $municipio)
                            <option value="{{$municipio->clave}}">{{$municipio->clave}} {{$municipio->nombre}}</option>
                            @endforeach
                        </select >     
                    </div>
                    <div class="form-group col-md-6">    
                        <label>Localidad</label>
                        <select class="form-control" name="cbocat_localidad_esta" id="cbocat_localidad_esta">
                            @foreach($localidades as $localidad)
                            <option value="{{$localidad->cv_localidad}}">{{$localidad->cv_localidad}} {{$localidad->nombre}}</option>
                            @endforeach
                        </select >     
                    </div>
                    <div class="form-group col-md-6">        
                    <label>Colonia</label>
                        <select class="form-control" name="cbocat_colonia_esta" id="cbocat_colonia_esta">
                            @foreach($colonias as $colonia)
                            <option value="{{$colonia->cv_colonia}}">{{$colonia->cv_colonia}} {{$colonia->nombre}}</option>
                            @endforeach
                        </select >     
                    </div>    
                  
                  </div>
                  
                <div class="form-group row">
                <div class="form-group col-md-4">
                      <label>CP</label>
                        <input class="form-control" type="text" id="txtcp_esta" name="txtcp_esta">
                  </div>
                  <div class="form-group col-md-4">
                      <label>Clave Catastral</label>
                      <input class="form-control" type="text" id="txtclavecata_esta" name="txtclavecata_esta">
                    </div>
                </div>  

                <div class="form-row">
                <label class="form-group">Calle </label>
                  <div class="form-group col-md-1">
                      <input readonly class="form-control" type="text" id="txtcalleclave_esta" name="txtcalleclave_esta">
                  </div>          
                  <div class="form-group col-md-10">
                      <input onkeyup="borraclavecalle()" class="form-control" type="text" id="txtcalle_esta" name="txtcalle_esta">
                  </div>    
                </div>
                
                <div class="form-row">
                <label class="form-group">entre </label>
                  <div class="form-group col-md-1">
                      <input readonly class="form-control" type="text" id="txtentreclave_esta" name="txtentreclave_esta">
                  </div>          
                  <div class="form-group col-md-10">
                      <input onkeyup="borraclaventre()" class="form-control" type="text" id="txtentre_esta" name="txtentre_esta">
                  </div>    
                </div>
                
                <div class="form-row">
                  <label class="form-group">y entre </label>
                  <div class="form-group col-md-1">
                      <input readonly class="form-control" type="text" id="txtyentreclave_esta" name="txtyentreclave_esta">
                  </div>          
                  <div class="form-group col-md-10">
                      <input onkeyup="borraclaveyentre()" class="form-control" type="text" id="txtyentre_esta" name="txtyentre_esta">
                  </div>    
                </div>
                
                <br>

                    <!-- Button trigger modal -->
              <button onclick="limpiatablacalles()" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                  Busca calles
              </button>
              <br>
              <br>
                  <div class="form-group row">
                    <div class="form-group col-md-6">
                      <label>NO Interior</label>
                      <input class="form-control" type="text" id="txtnoint_esta" name="txtnoint_esta">    
                    </div>    
                    <div class="form-group col-md-6">
                      <label>NO Exterior</label>
                      <input class="form-control" type="text" id="txtnoext_esta" name="txtnoext_esta">    
                    </div>    
                  </div>   
              
            </div>

            <div id = "buscanotificar" class="tabcontent">
                <h3 >DOMICILIO A NOTIFICAR</h3>
                <br>
                  <div class="form-group row">
                  
                      <div class="form-group col-md-6">    
                          <label>Entidad</label>
                          <select class="form-control" name="cbocat_entidades_noti" id="cbocat_entidades_noti">
                              @foreach($entidades as $entidad)
                              <option value="{{$entidad->clave}}"> {{$entidad->clave}} {{$entidad->nombre}}</option>
                              @endforeach
                          </select >     
                      </div>

                      <div class="form-group col-md-6">    
                          <label>Municipio</label>
                          <input class="form-control" type="text" id="txtmunicipio_noti" name="txtmunicipio_noti">
                      </div>
                      <div class="form-group col-md-6">    
                          <label>Localidad</label>
                          <input class="form-control" type="text" id="txtlocalidad_noti" name="txtlocalidad_noti">
                      </div>
                      <div class="form-group col-md-6">        
                          <label>Colonia</label>
                          <input class="form-control" type="text" id="txtcolonia_noti" name="txtcolonia_noti">
                      </div>    
                  
                  </div>
                  
                  <div class="form-group row">
                    <div class="form-group col-md-4">
                      <label>CP</label>
                      <input class="form-control" type="text" id="txtcp_noti" name="txtcp_noti">
                    </div>
                    <div class="form-group col-md-4">
                      <label>Clave Catastral</label>
                      <input class="form-control" type="text" id="txtclavecata_noti" name="txtclavecata_noti">
                    </div>        
                  </div>


                  <label>Calle</label>
                  <input class="form-control" type="text" id="txtcalle_noti" name="txtcalle_noti">
                  <br>
                  <label>Entre</label>
                  <input class="form-control" type="text" id="txtentre_noti" name="txtentre_noti">
                  <br>

                  <label>Y Entre</label>
                  <input class="form-control" type="text" id="txtyentre_noti" name="txtyentre_noti">
                  <br>

                  <div class="form-group row">
                    <div class="form-group col-md-6">
                      <label>NO Interior</label>
                      <input class="form-control" type="text" id="txtnoint_noti" name="txtnoint_noti">    
                    </div>    
                    <div class="form-group col-md-6">
                      <label>NO Exterior</label>
                      <input class="form-control" type="text" id="txtnoext_noti" name="txtnoext_noti">    
                    </div>    
                  </div>

            </div>

            <div id = "buscafiscal" class="tabcontent">
                <h3 >DOMICILIO FISCAL</h3>
                <br>
                  <div class="form-group row">
                  
                    <div class="form-group col-md-6">    
                        <label>Entidad</label>
                        <select class="form-control" name="cbocat_entidades_fis" id="cbocat_entidades_fis">
                            @foreach($entidades as $entidad)
                            <option value="{{$entidad->clave}}">{{$entidad->clave}} {{$entidad->nombre}}</option>
                            @endforeach
                        </select >     
                    </div>

                    <div class="form-group col-md-6">    
                        <label>Municipio</label>
                        <input class="form-control" type="text" id="txtmunicipio_fis" name="txtmunicipio_fis">
                    </div>
                    <div class="form-group col-md-6">    
                        <label>Localidad</label>
                        <input class="form-control" type="text" id="txtlocalidad_fis" name="txtlocalidad_fis">
                    </div>
                    <div class="form-group col-md-6">        
                        <label>Colonia</label>
                        <input class="form-control" type="text" id="txtcolonia_fis" name="txtcolonia_fis">
                    </div>    
                  

                  </div>
                  
                  <div class="form-group row">
                    <div class="form-group col-md-4">
                      <label>CP</label>
                      <input class="form-control" type="text" id="txtcp_fis" name="txtcp_fis">
                    </div>
                    <div class="form-group col-md-4">
                      <label>Clave Catastral</label>
                      <input class="form-control" type="text" id="txtclavecata_fis" name="txtclavecata_fis">
                    </div>        
                  </div>


                  <label>Calle</label>
                  <input class="form-control" type="text" id="txtcalle_fis" name="txtcalle_fis">
                  <br>
                  <label>Entre</label>
                  <input class="form-control" type="text" id="txtentre_fis" name="txtentre_fis">
                  <br>

                  <label>Y Entre</label>
                  <input class="form-control" type="text" id="txtyentre_fis" name="txtyentre_fis">
                  <br>

                  <div class="form-group row">
                    <div class="form-group col-md-6">
                      <label>NO Interior</label>
                      <input class="form-control" type="text" id="txtnoint_fis" name="txtnoint_fis">    
                    </div>    
                    <div class="form-group col-md-6">
                      <label>NO Exterior</label>
                      <input class="form-control" type="text" id="txtnoext_fis" name="txtnoext_fis">    
                    </div>    
                  </div>

            </div>

            <button type="submit" form="Guarubicacion" onclick="return confirm('Desea Agregar la ubicacion?')" class="btn btn-primary" >
              GRABA UBICACION
            </button>  
            
            <a class="btn btn-info" href="{{ url('/padron') }}" role="button">
                REGRESA
            </a>

          </div>

    </div>
  
</form>

<table id ="tablaubicacontri" class="table table-bordered table-hover">
    <thead class="thead-light">
        <tr>
        <th>ID</th>
        <th>TIPO DOMICILIO</th>
        <th>CALLE</th>
        <th>ENTRE</th>
        <th>Y ENTRE</th>
        <th>ACCIÓN</th>
        </tr>
    </thead>
    <tbody>
    @foreach($listas as $lista)
          <tr>
              <td>{{$lista->id_domicilio}}</td>
              <td>{{ $lista->tipo_domicilio }}</td>
              <td>{{ $lista->calle }}</td>
              <td>{{ $lista->entre }}</td>
              <td>{{ $lista->yentre }}</td>
              <td>
                <a href="{{ url('/ubicacion/'.$lista->id_domicilio.'/edit') }}">
                        Editar
                </a>
              </td>
          </tr>
      @endforeach      

    </tbody>
    
</table>

{{$listas->links()}}

<!-- Modal busca calle -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">

        <div class="container p-3 my-3 border">
          <fieldset id="optBuscapor">
              <div class="form-check form-check-inline">
                <input type="radio" id ="optbuscacalle" name="optBuscaporcalle" value="1" checked> calle
              </div>
              <div class="form-check form-check-inline">
                <input type="radio" id="optbuscaentre" name="optBuscaporcalle" value="2"> entre
              </div>
              <div class="form-check form-check-inline">
                <input type="radio" id="optbuscayentre" name="optBuscaporcalle" value="3"> y entre
              </div>  
          </fieldset>
          <br>
          <div class="form-row">
          <label class="form-group">Calle </label>
          <div class="form-group col-md-10">
              <input class="form-control" type="text" id="txtBuscaCalle_modal" name="txtBuscaCalle_modal">
          </div>    
        </div>

      </div>

        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <table id ="tablacalle" class="table table-bordered table-hover">
      <tr>
        <th>clave</th>
        <th>nombre</th>
      </tr>
      </table>

      </div>
      <div class="modal-footer">
        <button onclick="BuscaCallesuc()" type="button" class="btn btn-primary">Busca calles</button>  
        <button type="button" class="btn btn-secondary" data-dismiss="modal">cerrar</button>
      </div>
    </div>
  </div>

</div>
<!-- Modal -->

@endsection 

<script>
function tabusca(evt, destipocap) 
  {
    
    var i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tabcontent");
    
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(destipocap).style.display = "block";
    evt.currentTarget.className += " active";
        
  }
</script>

<script>
  function iniciatabs()
  {
          
    var i, tabcontent;
   
    tabcontent = document.getElementsByClassName("tabcontent");
    
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tabcontent[0].style.display = "block";

    document.getElementsByClassName("optestablecimiento").cheked=true;
    
  }

  window.onload = iniciatabs;
  

</script>  

<script>
function borraclavecalle()
  {
    document.getElementById('txtcalleclave_esta').value="";
  }

</script>  

<script>
function borraclaventre()
  {
    document.getElementById('txtentreclave_esta').value="";
  }

</script>  

<script>
function borraclaveyentre()
  {
    document.getElementById('txtyentreclave_esta').value="";
  }

</script>  

<script>
function BuscaCallesuc()
{
   var calle_bus_uc="";
   calle_bus_uc = document.getElementById('txtBuscaCalle_modal').value;


   limpiatablacalles();

   axios.get('calles', {
          params: {
            busca_calle_uc: calle_bus_uc            
          }
        })
        .then(function (response) {
        
        for (var i = 0; i < response.data.length; i+=1) 
        {
          var tr = `<tr ondblclick="seleccionaTe(this)">
            <td>`+ response.data[i].cv_via + `</td>
            <td>` + response.data[i].nombre + `</td>
          </tr>`;
          
         // console.log(response.data);
          //$('#tablecontri_uc').append(tr);
          $('#tablacalle tr:last').after(tr);
        }
        
    });



}
</script>  

<script>  
function seleccionaTe(x) 
{
  var table = document.getElementById("tablacalle");

  if (document.getElementById('optbuscacalle').checked )
  {
   document.getElementById('txtcalleclave_esta').value=table.rows[x.rowIndex].cells[0].innerHTML;
   document.getElementById('txtcalle_esta').value=table.rows[x.rowIndex].cells[1].innerHTML;
  }

  if (document.getElementById('optbuscaentre').checked )
  {
   document.getElementById('txtentreclave_esta').value=table.rows[x.rowIndex].cells[0].innerHTML;
   document.getElementById('txtentre_esta').value=table.rows[x.rowIndex].cells[1].innerHTML;
  }

  if (document.getElementById('optbuscayentre').checked )
  {
   document.getElementById('txtyentreclave_esta').value=table.rows[x.rowIndex].cells[0].innerHTML;
   document.getElementById('txtyentre_esta').value=table.rows[x.rowIndex].cells[1].innerHTML;
  }
  
} 
</script>   



<script>
 function limpiatablacalles()
  {
  
    var nofilas=document.getElementById("tablacalle").rows.length;
    
    if (nofilas>1)
    {

      for (var fila=nofilas-1; fila > 1 ; fila-=1) {

        document.getElementById("tablacalle").deleteRow(fila);

      }

      document.getElementById("tablacalle").deleteRow(1);
      
    }

  }

</script>


