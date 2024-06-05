@extends('layouts.app')

@section('content')

<form action= "{{ url('/ubicacion/'.$ubicacion->id_domicilio) }}" method="post">

@csrf
  {{ method_field('PATCH')}}

    <div class="container">
        <h3 >Modifica Ubicación del contribuyente</h3>
        
        <div class="container p-3 my-3 border">
            <fieldset id="agrupapordom">
                <div class="form-check form-check-inline">
                    @if($ubicacion->tipo_domicilio == "NORMAL")  
                        <input class="form-control" type="hidden" id="txttipo_domicilio" name="txttipo_domicilio" value="{{ isset($ubicacion->tipo_domicilio)?$ubicacion->tipo_domicilio:'' }}">           
                        <input class="tablinks" onchange="tabusca(event, 'buscanormal')" type="radio" id ="optnormal" name="optdespliubica" value="1" checked> Domicilio del Contribuyente
                    @endif      
                </div>
                <div class="form-check form-check-inline">
                    @if($ubicacion->tipo_domicilio == "ESTABLECIMIENTO")
                    <input class="form-control" type="hidden" id="txttipo_domicilio" name="txttipo_domicilio" value="{{ isset($ubicacion->tipo_domicilio)?$ubicacion->tipo_domicilio:'' }}">                          
                        <input class="tablinks" onchange="activa('buscaestablecimiento')" type="radio" id="optestablecimiento" name="optdespliubica" value="2" checked> Domicilio del Establecimiento  
                    @endif
                </div>
                <div class="form-check form-check-inline">
                    @if($ubicacion->tipo_domicilio == "NOTIFICAR")
                        <input class="form-control" type="hidden" id="txttipo_domicilio" name="txttipo_domicilio" value="{{ isset($ubicacion->tipo_domicilio)?$ubicacion->tipo_domicilio:'' }}">                            
                        <input class="tablinks" onchange="tabusca(event, 'buscanotificar')" type="radio" id="optnotificar" name="optdespliubica" value="3" checked> Domicilio a Notificar            
                    @endif  
                </div>  
                <div class="form-check form-check-inline">
                    @if($ubicacion->tipo_domicilio == "FISCAL") 
                        <input class="form-control" type="hidden" id="txttipo_domicilio" name="txttipo_domicilio" value="{{ isset($ubicacion->tipo_domicilio)?$ubicacion->tipo_domicilio:'' }}">                           
                        <input class="tablinks" onchange="tabusca(event, 'buscafiscal')" type="radio" id="optfiscal" name="optdespliubica" value="4" checked> Domicilio Fiscal
                    @endif  
                </div>  
            </fieldset>
        </div>


        <div class="container p-3 my-3 border">

        @if($ubicacion->tipo_domicilio == "NORMAL")   
            <div id = "buscanormal" class="tabcontent">
              <h3 >Domicilio Contribuyente</h3>

                  <div class="form-group row">
                  
                    <div class="form-group col-md-6">    
                        <label>Entidad</label>
                        <select class="form-control" name="cbocat_entidades_con" id="cbocat_entidades_con">
                            <option value=" {{ isset($cbo_entidades[0]->clave)?$cbo_entidades[0]->clave:'' }} "> {{isset($cbo_entidades[0]->clave)?$cbo_entidades[0]->clave:''}} {{ isset($cbo_entidades[0]->nombre)?$cbo_entidades[0]->nombre:'' }}</option>                        
                              @foreach($entidades as $entidad)
                                <option value="{{isset($entidad->clave)?$entidad->clave:''}}">{{isset($entidad->clave)?$entidad->clave:''}} {{isset($entidad->nombre)?$entidad->nombre:''}}</option>
                              @endforeach
                        </select >     
                    </div>

                    <div class="form-group col-md-6">    
                        <label>Municipio</label>
                        <input class="form-control" type="text" id="txtmunicipio_con" name="txtmunicipio_con" value=" {{ isset($ubicacion->municipio)?$ubicacion->municipio:'' }} ">
                    </div>
                    <div class="form-group col-md-6">    
                        <label>Localidad</label>
                        <input class="form-control" type="text" id="txtlocalidad_con" name="txtlocalidad_con" value=" {{ isset($ubicacion->localidad)?$ubicacion->localidad:'' }} ">
                    </div>
                    <div class="form-group col-md-6">        
                        <label>Colonia</label>
                        <input class="form-control" type="text" id="txtcolonia_con" name="txtcolonia_con" value=" {{ isset($ubicacion->colonia)?$ubicacion->colonia:'' }} ">
                    </div>    
                  
                  </div>
                  
                  <div class="form-group row">
                    <div class="form-group col-md-4">
                      <label>CP</label>
                      <input class="form-control" type="text" id="txtcp_con" name="txtcp_con" value=" {{ isset($ubicacion->cp)?$ubicacion->cp:'' }} ">
                    </div>
                    <div class="form-group col-md-4">
                      <label>Clave Catastral</label>
                      <input class="form-control" type="text" id="txtclavecata_con" name="txtclavecata_con" value=" {{ isset($ubicacion->clavecatastral)?$ubicacion->clavecatastral:'' }} ">
                    </div>
                  </div>


                  <label>Calle</label>
                  <input class="form-control" type="text" id="txtcalle_con" name="txtcalle_con" value=" {{ isset($ubicacion->calle)?$ubicacion->calle:'' }} ">
                  <br>
                  <label>Entre</label>
                  <input class="form-control" type="text" id="txtentre_con" name="txtentre_con" value=" {{ isset($ubicacion->entre)?$ubicacion->entre:'' }} ">
                  <br>

                  <label>Y Entre</label>
                  <input class="form-control" type="text" id="txtyentre_con" name="txtyentre_con" value=" {{ isset($ubicacion->yentre)?$ubicacion->yentre:'' }} ">
                  <br>

                  <div class="form-group row">
                    <div class="form-group col-md-6">
                      <label>NO Interior</label>
                      <input class="form-control" type="text" id="txtnoint_con" name="txtnoint_con" value=" {{ isset($ubicacion->numint)?$ubicacion->numint:'' }} ">    
                    </div>    
                    <div class="form-group col-md-6">
                      <label>NO Exterior</label>
                      <input class="form-control" type="text" id="txtnoext_con" name="txtnoext_con" value=" {{ isset($ubicacion->numext)?$ubicacion->numext:'' }} ">    
                    </div>    
                  </div>
            </div>
        @endif      
        
        @if($ubicacion->tipo_domicilio == "ESTABLECIMIENTO")  
            <div id = "buscaestablecimiento" class="tabcontent">
                <h3 >Domicilio del Establecimiento</h3>
                  <div class="form-group row">
                  
                    <div class="form-group col-md-6">    
                        <label>Entidad</label>
                        <select class="form-control" name="cbocat_entidades_esta" id="cbocat_entidades_esta">
                            <option value=" {{ isset($cbo_entidades[0]->clave)?$cbo_entidades[0]->clave:'' }} "> {{isset($cbo_entidades[0]->clave)?$cbo_entidades[0]->clave:''}} {{ isset($cbo_entidades[0]->nombre)?$cbo_entidades[0]->nombre:'' }}</option>                        
                            @foreach($entidades as $entidad)
                            <option value="{{isset($entidad->clave)?$entidad->clave:''}}">{{isset($entidad->clave)?$entidad->clave:''}} {{isset($entidad->nombre)?$entidad->nombre:''}}</option>
                            @endforeach
                        </select >     
                    </div>

                    <div class="form-group col-md-6">    
                        <label>Municipio</label>
                        <select class="form-control" name="cbocat_municipios_esta" id="cbocat_municipios_esta">
                           <option value="{{ isset($cbo_municipios[0]->clave)?$cbo_municipios[0]->clave:'' }}">{{ isset($cbo_municipios[0]->clave)?$cbo_municipios[0]->clave:'' }} {{ isset($cbo_municipios[0]->nombre)?$cbo_municipios[0]->nombre:'' }}</option>                        
                            @foreach($municipios as $municipio)
                            <option value="{{isset($municipio->clave)?$municipio->clave:''}}">{{isset($municipio->clave)?$municipio->clave:''}} {{isset($municipio->nombre)?$municipio->nombre:''}}</option>
                            @endforeach
                        </select >     
                    </div>

                    <div class="form-group col-md-6">    
                        <label>Localidad</label>
                        <select class="form-control" name="cbocat_localidad_esta" id="cbocat_localidad_esta">
                            <option value="{{ isset($cbo_localidades[0]->cv_localidad)?$cbo_localidades[0]->cv_localidad:'' }}">{{ isset($cbo_localidades[0]->cv_localidad)?$cbo_localidades[0]->cv_localidad:'' }} {{ isset($cbo_localidades[0]->nombre)?$cbo_localidades[0]->nombre:'' }}</option>                        
                            @foreach($localidades as $localidad)
                            <option value="{{isset($localidad->cv_localidad)?$localidad->cv_localidad:''}}">{{ isset($localidad->cv_localidad)?$localidad->cv_localidad:'' }} {{ isset($localidad->nombre)?$localidad->nombre:'' }}</option>
                            @endforeach
                        </select >     
                    </div>

                    <div class="form-group col-md-6">        
                      <label>Colonia</label>
                      <select class="form-control" name="cbocat_colonia_esta" id="cbocat_colonia_esta">     
                      <option value="{{ isset($cbo_colonias[0]->cv_colonia)?$cbo_colonias[0]->cv_colonia:'' }}">{{ isset($cbo_colonias[0]->cv_colonia)?$cbo_colonias[0]->cv_colonia:'' }} {{ isset($cbo_colonias[0]->nombre)?$cbo_colonias[0]->nombre:'' }}</option>                        
                              @foreach($colonias as $colonia)
                              <option value="{{isset($colonia->cv_colonia)?$colonia->cv_colonia:''}}">{{ isset($colonia->cv_colonia)?$colonia->cv_colonia:'' }} {{ isset($colonia->nombre)?$colonia->nombre:'' }}</option>
                              @endforeach
                          </select >     
                    </div>    
                  
                  </div>
                
                <div class="form-group row">
                <div class="form-group col-md-4">
                      <label>CP</label>
                        <input class="form-control" type="text" id="txtcp_esta" name="txtcp_esta" value="{{ isset($ubicacion->cp)?$ubicacion->cp:'' }}" >
                  </div>
                  
                  <div class="form-group col-md-4">
                      <label>Clave Catastral</label>
                      <input class="form-control" type="text" id="txtclavecata_esta" name="txtclavecata_esta" value=" {{ isset($ubicacion->clavecatastral)?$ubicacion->clavecatastral:'' }} ">
                    </div>
                </div>  

                <div class="form-row">
                <label class="form-group">Calle </label>
                  <div class="form-group col-md-1">
                      <input readonly class="form-control" type="text" id="txtcalleclave_esta" name="txtcalleclave_esta" value=" {{ isset($ubicacion->cve_calle_principal)?$ubicacion->cve_calle_principal:'' }} ">
                  </div>          
                  <div class="form-group col-md-10">
                      <input onkeyup="borraclavecalle()" class="form-control" type="text" id="txtcalle_esta" name="txtcalle_esta" value=" {{ isset($ubicacion->calle)?$ubicacion->calle:'' }} ">
                  </div>    
                </div>
                
                <div class="form-row">
                <label class="form-group">entre </label>
                  <div class="form-group col-md-1">
                      <input readonly class="form-control" type="text" id="txtentreclave_esta" name="txtentreclave_esta" value=" {{ isset($ubicacion->cve_calle_entre)?$ubicacion->cve_calle_entre:'' }} ">
                  </div>          
                  <div class="form-group col-md-10">
                      <input onkeyup="borraclaventre()" class="form-control" type="text" id="txtentre_esta" name="txtentre_esta" value=" {{ isset($ubicacion->entre)?$ubicacion->entre:'' }} ">
                  </div>    
                </div>
                
                <div class="form-row">
                  <label class="form-group">y entre </label>
                  <div class="form-group col-md-1">
                      <input readonly class="form-control" type="text" id="txtyentreclave_esta" name="txtyentreclave_esta" value=" {{ isset($ubicacion->cve_calle_y_entre)?$ubicacion->cve_calle_y_entre:'' }} ">
                  </div>          
                  <div class="form-group col-md-10">
                      <input onkeyup="borraclaveyentre()" class="form-control" type="text" id="txtyentre_esta" name="txtyentre_esta" value=" {{ isset($ubicacion->yentre)?$ubicacion->yentre:'' }} ">
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
                      <input class="form-control" type="text" id="txtnoint_esta" name="txtnoint_esta" value=" {{ isset($ubicacion->numint)?$ubicacion->numint:'' }} ">    
                    </div>    
                    <div class="form-group col-md-6">
                      <label>NO Exterior</label>
                      <input class="form-control" type="text" id="txtnoext_esta" name="txtnoext_esta" value=" {{ isset($ubicacion->numext)?$ubicacion->numext:'' }} ">    
                    </div>    
                  </div>   
            
            </div>
        @endif      

        @if($ubicacion->tipo_domicilio == "NOTIFICAR")  
             <div id = "buscanotificar" class="tabcontent">
                <h3 >Domicilio a Notificar</h3>
                  <div class="form-group row">
                  
                      <div class="form-group col-md-6">    
                          <label>Entidad</label>
                          <select class="form-control" name="cbocat_entidades_noti" id="cbocat_entidades_noti">
                              <option value=" {{ isset($cbo_entidades[0]->clave)?$cbo_entidades[0]->clave:'' }} "> {{isset($cbo_entidades[0]->clave)?$cbo_entidades[0]->clave:''}} {{ isset($cbo_entidades[0]->nombre)?$cbo_entidades[0]->nombre:'' }}</option>                        
                              @foreach($entidades as $entidad)
                              <option value="{{isset($entidad->clave)?$entidad->clave:''}}">{{isset($entidad->clave)?$entidad->clave:''}} {{isset($entidad->nombre)?$entidad->nombre:''}}</option>
                              @endforeach
                          </select >     
                      </div>

                      <div class="form-group col-md-6">    
                          <label>Municipio</label>
                          <input class="form-control" type="text" id="txtmunicipio_noti" name="txtmunicipio_noti" value=" {{ isset($ubicacion->municipio)?$ubicacion->municipio:'' }} ">
                      </div>
                      <div class="form-group col-md-6">    
                          <label>Localidad</label>
                          <input class="form-control" type="text" id="txtlocalidad_noti" name="txtlocalidad_noti" value=" {{ isset($ubicacion->localidad)?$ubicacion->localidad:'' }} ">
                      </div>
                      <div class="form-group col-md-6">        
                          <label>Colonia</label>
                          <input class="form-control" type="text" id="txtcolonia_noti" name="txtcolonia_noti" value=" {{ isset($ubicacion->colonia)?$ubicacion->colonia:'' }} ">
                      </div>    
                  
                  </div>
                  
                  <div class="form-group row">
                    <div class="form-group col-md-4">
                      <label>CP</label>
                      <input class="form-control" type="text" id="txtcp_noti" name="txtcp_noti" value=" {{ isset($ubicacion->cp)?$ubicacion->cp:'' }} ">
                    </div>
                    <div class="form-group col-md-4">
                      <label>Clave Catastral</label>
                      <input class="form-control" type="text" id="txtclavecata_noti" name="txtclavecata_noti" value=" {{ isset($ubicacion->clavecatastral)?$ubicacion->clavecatastral:'' }} ">
                    </div>        
                  </div>


                  <label>Calle</label>
                  <input class="form-control" type="text" id="txtcalle_noti" name="txtcalle_noti" value=" {{ isset($ubicacion->calle)?$ubicacion->calle:'' }} ">
                  <br>
                  <label>Entre</label>
                  <input class="form-control" type="text" id="txtentre_noti" name="txtentre_noti" value=" {{ isset($ubicacion->entre)?$ubicacion->entre:'' }} ">
                  <br>

                  <label>Y Entre</label>
                  <input class="form-control" type="text" id="txtyentre_noti" name="txtyentre_noti" value=" {{ isset($ubicacion->yentre)?$ubicacion->yentre:'' }} ">
                  <br>

                  <div class="form-group row">
                    <div class="form-group col-md-6">
                      <label>NO Interior</label>
                      <input class="form-control" type="text" id="txtnoint_noti" name="txtnoint_noti" value=" {{ isset($ubicacion->numint)?$ubicacion->numint:'' }} ">    
                    </div>    
                    <div class="form-group col-md-6">
                      <label>NO Exterior</label>
                      <input class="form-control" type="text" id="txtnoext_noti" name="txtnoext_noti" value=" {{ isset($ubicacion->numext)?$ubicacion->numext:'' }} ">    
                    </div>    
                  </div>

            </div>
        @endif 

        @if($ubicacion->tipo_domicilio == "FISCAL") 
            <div id = "buscafiscal" class="tabcontent">
                <h3 >Domicilio Fiscal</h3>
                  <div class="form-group row">
                  
                    <div class="form-group col-md-6">    
                        <label>Entidad</label>
                        <select class="form-control" name="cbocat_entidades_fis" id="cbocat_entidades_fis">
                        <option value=" {{ isset($cbo_entidades[0]->clave)?$cbo_entidades[0]->clave:'' }} "> {{isset($cbo_entidades[0]->clave)?$cbo_entidades[0]->clave:''}} {{ isset($cbo_entidades[0]->nombre)?$cbo_entidades[0]->nombre:'' }}</option>                        
                            @foreach($entidades as $entidad)
                            <option value="{{isset($entidad->clave)?$entidad->clave:''}}">{{ isset($entidad->clave)?$entidad->clave:'' }} {{ isset($entidad->nombre)?$entidad->nombre:'' }}</option>
                            @endforeach
                        </select >     
                    </div>

                    <div class="form-group col-md-6">    
                        <label>Municipio</label>
                        <input class="form-control" type="text" id="txtmunicipio_fis" name="txtmunicipio_fis" value=" {{ isset($ubicacion->municipio)?$ubicacion->municipio:'' }} ">
                    </div>
                    <div class="form-group col-md-6">    
                        <label>Localidad</label>
                        <input class="form-control" type="text" id="txtlocalidad_fis" name="txtlocalidad_fis" value=" {{ isset($ubicacion->localidad)?$ubicacion->localidad:'' }} ">
                    </div>
                    <div class="form-group col-md-6">        
                        <label>Colonia</label>
                        <input class="form-control" type="text" id="txtcolonia_fis" name="txtcolonia_fis" value=" {{ isset($ubicacion->colonia)?$ubicacion->colonia:'' }} ">
                    </div>    
                  

                  </div>
                  
                  <div class="form-group row">
                    <div class="form-group col-md-4">
                      <label>CP</label>
                      <input class="form-control" type="text" id="txtcp_fis" name="txtcp_fis" value=" {{ isset($ubicacion->cp)?$ubicacion->cp:'' }} ">
                    </div>
                    <div class="form-group col-md-4">
                      <label>Clave Catastral</label>
                      <input class="form-control" type="text" id="txtclavecata_fis" name="txtclavecata_fis" value=" {{ isset($ubicacion->clavecatastral)?$ubicacion->clavecatastral:'' }} ">
                    </div>        
                  </div>


                  <label>Calle</label>
                  <input class="form-control" type="text" id="txtcalle_fis" name="txtcalle_fis" value=" {{ isset($ubicacion->calle)?$ubicacion->calle:'' }} ">
                  <br>
                  <label>Entre</label>
                  <input class="form-control" type="text" id="txtentre_fis" name="txtentre_fis" value=" {{ isset($ubicacion->entre)?$ubicacion->entre:'' }} ">
                  <br>

                  <label>Y Entre</label>
                  <input class="form-control" type="text" id="txtyentre_fis" name="txtyentre_fis" value=" {{ isset($ubicacion->yentre)?$ubicacion->yentre:'' }} ">
                  <br>

                  <div class="form-group row">
                    <div class="form-group col-md-6">
                      <label>NO Interior</label>
                      <input class="form-control" type="text" id="txtnoint_fis" name="txtnoint_fis" value=" {{ isset($ubicacion->numint)?$ubicacion->numint:'' }} ">    
                    </div>    
                    <div class="form-group col-md-6">
                      <label>NO Exterior</label>
                      <input class="form-control" type="text" id="txtnoext_fis" name="txtnoext_fis" value=" {{ isset($ubicacion->numext)?$ubicacion->numext:'' }} ">    
                    </div>    
                  </div>

            </div>
        @endif      
         

            <button type="submit" onclick="return confirm('Desea actualizar la ubicacion?')" class="btn btn-primary" >
              ACTUALIZA
            </button>  
            
            <a class="btn btn-info" href="{{ url('/ubicacion/'.$ubicacion->id_puc) }}" role="button">
                REGRESA
            </a>

          </div>


   </div>

</form>

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




