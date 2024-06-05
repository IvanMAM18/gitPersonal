@extends('layouts.app')

@section('content')

  <form action= "{{ url('/refrendos/'.$datos->folio) }}" method="post" id="actualizasare">
    @csrf
    
    {{ method_field('PATCH') }}
    

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
   
          <h3 >Registro de refrendos</h3>
          <div class="container p-3 my-3 border">
          
            <h3 >Datos generales del solicitante</h3>
            <div class="form-group row">
                    
                <div class="form-group col-md-4">
                  <label>Folio de Apertura</label>
                  <input readonly class="form-control" type="text" id="txtfolioapertura" name="txtfolioapertura" value="{{isset($datos->folio)?$datos->folio:''}}">
                </div>    
        
                <div class="form-group col-md-4">
                  <label>Clave Municipal </label>   
                  <input readonly class="form-control" type="text" id="txtclaveregmpal" name="txtclaveregmpal" value="{{old('txtclaveregmpal',isset($datos->claveregmpal )?$datos->claveregmpal :'')}}">
                </div> 
              
                <div class="form-group col-md-4">
                  <label>Tipo de negocio</label>   
                    <select class="form-control" name="cbocat_negocios" id="cbocat_negocios">
                      <option value="{{isset($cboinf_tiponego->cv_tipo_negocio)?$cboinf_tiponego->cv_tipo_negocio:''}}"> {{isset($cboinf_tiponego->descripcion)?$cboinf_tiponego->descripcion:''}} </option>
                        @foreach($negocios as $negocio)
                          <option value="{{isset($negocio->cv_tipo_negocio)?$negocio->cv_tipo_negocio:''}}">{{isset($negocio->descripcion)?$negocio->descripcion:''}}</option>
                        @endforeach
                      </select >                      
                </div>             
            </div>          
            
            <div class="form-group row">
  
              <div class="form-group col-md-4">
                  <label>Fecha del registro </label>
                  <input readonly type="date" id="txtfecha" name="txtfecha">
              </div>               
              <div class="form-group col-md-4">
                      <label>Año a refrendar</label>
                      <input readonly class="form-control" type="text" id="txtfecharefrendo" name="txtfecharefrendo">
              </div>          
              <div class="form-group col-md-4">
                <label>Tipo de persona</label>
                  <fieldset id="grupopersona">
                  <input type="radio" id="optpersonafisica" name="optpersona" value="1" checked> Fisica
                  <input type="radio" id="optpersonamoral" name="optpersona" value="2"> Moral
                </fieldset>  
              </div> 
                              
            </div>
  
            <br>
  
              <label>Razon Social</label>
                <input class="form-control" type="text" id="txtrazonsocial" name="txtrazonsocial" maxlength="100" value="{{old('txtrazonsocial',isset($datos->nombre_sol)?$datos->nombre_sol:'')}}">
                  @error('txtrazonsocial')
                    <div class="alert alert-danger" role="alert">
                        <small> {{$message}} </small>
                        </div>    
                  @enderror
                <br>
                <label>Apellido Paterno</label>
                <input class="form-control" type="text" id="txtApellidoPaterno" name="txtApellidoPaterno" maxlength="50" value="{{old('txtApellidoPaterno',isset($datos->apellido1_sol)?$datos->apellido1_sol:'')}}">
                <br>
                <label>Apellido Materno</label>
                <input class="form-control" type="text" id="txtApellidoMaterno" name="txtApellidoMaterno" maxlength="50" value="{{old('txtApellidoMaterno',isset($datos->apellido2_sol )?$datos->apellido2_sol :'')}}">
                <br>
  
                <label>Calle</label>
                <input class="form-control" type="text" id="txtcalle" name="txtcalle" maxlength="100" value="{{old('txtcalle',isset($cat_domicilio_sol->calle )?$cat_domicilio_sol->calle :'')}}">
                @error('txtcalle')
                    <div class="alert alert-danger" role="alert">
                        <small> {{$message}} </small>
                        </div>    
                  @enderror
                <br>
  
                <label>Entre</label>
                <input class="form-control" type="text" id="txtentre" name="txtentre" maxlength="100" value="{{old('txtentre',isset($cat_domicilio_sol->entre )?$cat_domicilio_sol->entre :'')}}">
                <br>
                <label>Y Entre</label>
                <input class="form-control" type="text" id="txtyentre" name="txtyentre" maxlength="100" value="{{old('txtyentre',isset($cat_domicilio_sol->yentre )?$cat_domicilio_sol->yentre :'')}}">
  
                <br>
                <div class="form-group row">
                  <div class="form-group col-md-6">
                    <label>NO Interior</label>
                    <input class="form-control" type="text" id="txtnoint" name="txtnoint" maxlength="5" value="{{old('txtnoint',isset($cat_domicilio_sol->numint )?$cat_domicilio_sol->numint :'')}}">
                  </div>    
                  <div class="form-group col-md-6">
                    <label>NO Exterior</label>
                    <input class="form-control" type="text" id="txtNoExt" name="txtNoExt" maxlength="5" value="{{old('txtNoExt',isset($cat_domicilio_sol->numext )?$cat_domicilio_sol->numext :'')}}">
                  </div>    
                </div>
                
                <label>Colonia</label>
                <input class="form-control" type="text" id="txtcolonia" name="txtcolonia" maxlength="100" value="{{old('txtcolonia',isset($cat_domicilio_sol->colonia )?$cat_domicilio_sol->colonia :'')}}">
                <br>
                <label>Localidad</label>
                <input class="form-control" type="text" id="txtlocalidad" name="txtlocalidad" maxlength="100" value="{{old('txtlocalidad',isset($cat_domicilio_sol->localidad )?$cat_domicilio_sol->localidad :'')}}">
                <br>
  
                <div class="form-group row">
                  <div class="form-group col-md-6">
                    <label>Codigo Postal</label>
                    <input class="form-control" type="text" id="txtcp" name="txtcp" maxlength="10" value="{{old('txtcp',isset($cat_domicilio_sol->cp )?$cat_domicilio_sol->cp :'')}}">
                  </div>
                  <div class="form-group col-md-6">
                    <label>Telefono</label>
                    <input class="form-control" type="text" id="txttel" name="txttel" maxlength="20" value="{{old('txttel',isset($cat_contactalos_sol->telefono)?$cat_contactalos_sol->telefono :'')}}">
                  </div>
                  <div class="form-group col-md-6">
                    <label>Celular</label>
                    <input class="form-control" type="text" id="txtcel" name="txtcel" maxlength="20" value="{{old('txtcel',isset($cat_contactalos_sol->celular)?$cat_contactalos_sol->celular :'')}}">
                  </div>  
                  <div class="form-group col-md-6">
                    <label>CURP</label>
                    <input class="form-control" type="text" id="txtcurp" name="txtcurp" maxlength="30" value="{{old('txtcurp',isset($datos->curp_sol)?$datos->curp_sol :'')}}">
                  </div>  
                  <div class="form-group col-md-6">
                    <label>RFC</label>
                    <input class="form-control" type="text" id="txtrfc" name="txtrfc" maxlength="40" value="{{old('txtrfc',isset($datos->rfc_sol)?$datos->rfc_sol :'')}}">
                  </div>  
                  <div class="form-group col-md-6">
                    <label>No de Credencial</label>
                    <input class="form-control" type="text" id="txtnocredencial" name="txtnocredencial" maxlength="50" value="{{old('txtnocredencial',isset($datos->num_credencial)?$datos->num_credencial :'')}}">
                  </div>  
                </div> 
  
                <label>Organismo o Asociación</label> 
                <select class="form-control" name="cbocat_camaras" id="cbocat_camaras">
                <option value="{{ isset($cboinf_camara->id_cat_camara)?$cboinf_camara->id_cat_camara:'' }}">{{ isset($cboinf_camara->descripcion)?$cboinf_camara->descripcion:'' }}</option>                        
                  @foreach($camaras as $camara)
                  <option value="{{$camara->id_cat_camara}}">{{$camara->descripcion}}</option>
                  @endforeach
                </select >
                <br>
                <div class="btn-group" role="group">
                  <!-- Button trigger modal -->
                  <button onclick="limpiatablacontri()" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    BUSCA CONTRIBUYENTE
                  </button>
                  <br>
                  <button disabled id = "btn_bus_dom" onclick="limpiatabladom('NORMAL')" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal1">
                    BUSCA DOMICILIO 
                  </button>
                  <br>
                  <a class="btn btn-info" href="{{ url('/padron') }}" role="button" onclick="return confirm('DESEA AGREGAR UN CONTRIBUYENTE?')">
                    AGREGA CONTRIBUYENTE
                  </a>  
                </div>  
  
          </div>
  
            <div class="container p-3 my-3 border">
              <legend>Domicilio para recibir notificaciones</legend>
  
              <button disabled id = "btn_bus_dom_noti" onclick="limpiatabladom('NOTIFICAR')" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal1">
                BUSCA DOMICILIO NOTIFICACIONES
              </button>
              <br>
  
              <label>Calle</label>
              <input class="form-control" type="text" id="txtcallenoti" name="txtcallenoti" maxlength="100" value="{{old('txtcallenoti',isset($cat_domicilio_noti->calle)?$cat_domicilio_noti->calle :'')}}">
              @error('txtcallenoti')
              <div class="alert alert-danger" role="alert">
                <small> {{$message}} </small>
              </div>    
              @enderror
              <br>
              <label>Entre</label>
              <input class="form-control" type="text" id="txtentrenoti" name="txtentrenoti" maxlength="100" value="{{old('txtentrenoti',isset($cat_domicilio_noti->entre)?$cat_domicilio_noti->entre :'')}}">
              <br>
              <label>Y Entre</label>
              <input class="form-control" type="text" id="txtyentrenoti" name="txtyentrenoti" maxlength="100" value="{{old('txtyentrenoti',isset($cat_domicilio_noti->yentre)?$cat_domicilio_noti->yentre :'')}}">
              <br>
  
              <div class="form-group row">
                <div class="form-group col-md-6">
                  <label>No Interior</label>
                  <input class="form-control" type="text" id="txtnointnoti" name="txtnointnoti" maxlength="5" value="{{old('txtnointnoti',isset($cat_domicilio_noti->numint)?$cat_domicilio_noti->numint :'')}}">
                </div>
                <div class="form-group col-md-6">
                  <label>No Exterior</label>
                  <input class="form-control" type="text" id="txtnoextnoti" name="txtnoextnoti" maxlength="5" value="{{old('txtnoextnoti',isset($cat_domicilio_noti->numext)?$cat_domicilio_noti->numext :'')}}">
                </div>
              </div>
  
              <label>Colonia</label>
              <input class="form-control" type="text" id="txtcolonianoti" name="txtcolonianoti" maxlength="100" value="{{old('txtcolonianoti',isset($cat_domicilio_noti->colonia)?$cat_domicilio_noti->colonia :'')}}">
              <br>
              <label>Localidad</label> 
              <input class="form-control" type="text" id="txtlocalidadnoti" name="txtlocalidadnoti" maxlength="100" value="{{old('txtlocalidadnoti',isset($cat_domicilio_noti->localidad)?$cat_domicilio_noti->localidad :'')}}"> 
              <br>
  
              <div class="form-group col-md-6">
                <label>cp</label> 
                <input class="form-control" type="text" id="txtcpnoti" name="txtcpnoti" maxlength="10" value="{{old('txtcpnoti',isset($cat_domicilio_noti->cp)?$cat_domicilio_noti->cp :'')}}"> 
              </div>
              <br>
  
              <div class="form-group row">
                <div class="form-group col-md-6">
                  <label>Telefono</label>
                  <input class="form-control" type="text" id="txttelnoti" name="txttelnoti" maxlength="20" value="{{old('txttelnoti',isset($cat_contactalos_noti->telefono)?$cat_contactalos_noti->telefono :'')}}">
                </div>
                <div class="form-group col-md-6">
                  <label>Celular</label>
                  <input class="form-control" type="text" id="txtcelnoti" name="txtcelnoti" maxlength="20" value="{{old('txtcelnoti',isset($cat_contactalos_noti->celular)?$cat_contactalos_noti->celular :'')}}">
                </div>
              </div>  
  
              <br>
              <label>Nombre del representante legal</label>
              <input class="form-control" type="text" id="txtreprelegalnoti" name="txtreprelegalnoti" maxlength="100" value="{{old('txtreprelegalnoti',isset($datos->representate)?$datos->representate :'')}}">
              <br>
              <div class="form-group col-md-6">
                <label>Telefono Rep Legal</label>
                <input class="form-control" type="text" id="txtreprelegaltelnoti" name="txtreprelegaltelnoti" maxlength="20" value="{{old('txtreprelegaltelnoti',isset($cat_contactalos_rep->telefono)?$cat_contactalos_rep->telefono :'')}}">
              </div>  
              <br>
  
              <div class="form-group row">
                <div class="form-group col-md-6">
                  <label>Celular Rep Legal</label>
                  <input class="form-control"type="text" id="txtreprelegalcelnoti" name="txtreprelegalcelnoti" maxlength="20" value="{{old('txtreprelegalcelnoti',isset($cat_contactalos_rep->celular)?$cat_contactalos_rep->celular :'')}}">
                </div>  
                <div class="form-group col-md-6">
                  <label>Correo Rep Legal</label>
                  <input class="form-control" type="text" id="txtreprelegalcorreonoti" name="txtreprelegalcorreonoti" maxlength="50" value="{{old('txtreprelegalcorreonoti',isset($datos->correo_representante )?$datos->correo_representante :'')}}">
                </div>
              </div>  
              <br>
  
            </div>
  
            <div class="container p-3 my-3 border">
                
                <legend>Datos del establecimiento</legend>
  
                <button disabled id = "btn_bus_dom_esta" onclick="limpiatabladom('ESTABLECIMIENTO')" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal1">
                  BUSCA DOMICILIO ESTABLECIMIENTO
                </button>
                 <br> 
                <label>Nombre del establecimiento</label>
                <input class="form-control" type="text" id="txtnombrestable" name="txtnombrestable" maxlength="100" value="{{old('txtnombrestable',isset($datos->nombre_establecimiento )?$datos->nombre_establecimiento :'')}}">
                @error('txtnombrestable')
                    <div class="alert alert-danger" role="alert">
                        <small> {{$message}} </small>
                    </div>    
                  @enderror
                <br>
  
                <div class="form-group row">
  
                  <div class="form-group col-md-4">
                    <label>clave catastral</label>
                    <input class="form-control" type="text" id="txtclavecata" name="txtclavecata" maxlength="25" value="{{old('txtclavecata',isset($datos->clavecatastral )?$datos->clavecatastral :'')}}">
                  </div>
  
                  <div class="form-group col-md-4">        
                    <label>Folio catastral</label>
                    <input class="form-control" type="text"id="txtfoliocata" name="txtfoliocata" maxlength="5" value="{{old('txtfoliocata',isset($datos->foliocatastral )?$datos->foliocatastral :'')}}"> 
                    @error('txtrazonsocial')
                    <div class="alert alert-danger" role="alert">
                      <small> {{$message}} </small>
                    </div>    
                    @enderror
                  </div>
  
                  <div class="form-group col-md-4">  
                    <label>Tipo de predio</label>
                    <fieldset id="grupopredio">
                    
                    @if($datos->tipo_predio == "U")         
                      <input type="radio" id="opturbana" name="opttipopre" value="U" checked> Urbana
                      <input type="radio" id="optrustica" name="opttipopre" value="R"> Rustica
                      <input type="radio" id="optsuburbana" name="opttipopre" value="S"> Suburbana
                      <input type="radio" id="optespecial" name="opttipopre" value="E"> Especial
                    @endif
                    @if($datos->tipo_predio == "R")         
                      <input type="radio" id="opturbana" name="opttipopre" value="U"> Urbana
                      <input type="radio" id="optrustica" name="opttipopre" value="R" checked> Rustica
                      <input type="radio" id="optsuburbana" name="opttipopre" value="S"> Suburbana
                      <input type="radio" id="optespecial" name="opttipopre" value="E"> Especial
                    @endif
                    @if($datos->tipo_predio == "S")         
                      <input type="radio" id="opturbana" name="opttipopre" value="U"> Urbana
                      <input type="radio" id="optrustica" name="opttipopre" value="R"> Rustica
                      <input type="radio" id="optsuburbana" name="opttipopre" value="S" checked> Suburbana
                      <input type="radio" id="optespecial" name="opttipopre" value="E"> Especial
                    @endif
                    @if($datos->tipo_predio == "E")         
                      <input type="radio" id="opturbana" name="opttipopre" value="U"> Urbana
                      <input type="radio" id="optrustica" name="opttipopre" value="R"> Rustica
                      <input type="radio" id="optsuburbana" name="opttipopre" value="S"> Suburbana
                      <input type="radio" id="optespecial" name="opttipopre" value="E" checked> Especial
                    @endif
  
                    </fieldset>
                    <button onclick="BuscaPredial()" type="button" class="btn btn-secondary">
                      Checa predial
                    </button>  
                  </div>  
  
                </div>    
                
                <div class="form-group row">
                  <div class="form-group col-md-6">
                    <label>Superficie del local</label>
                    <input class="form-control" type="number" id="txtsuplocal" name="txtsuplocal" value="{{old('txtsuplocal',isset($datos->superficie )?$datos->superficie :'')}}"> 
                  </div>
                  <div class="form-group col-md-6">
                    <label>No de registro del S.S.A</label>
                    <input class="form-control" type="text" id="txtregistrossa" name="txtregistrossa" maxlength="50" value="{{old('txtregistrossa',isset($datos->ssa )?$datos->ssa :'')}}"> 
                  </div>
  
                </div>
  
  
                <label>Calle</label>
                <input class="form-control" type="text" id="txtcallesta" name="txtcallesta" maxlength="100" value="{{old('txtcallesta',isset($cat_domicilio_esta->calle )?$cat_domicilio_esta->calle :'')}}">
                @error('txtcallesta')
                    <div class="alert alert-danger" role="alert">
                        <small> {{$message}} </small>
                    </div>    
                  @enderror
                <br>
                <label>Entre</label>
                <input class="form-control" type="text" id="txtentresta" name="txtentresta" maxlength="100" value="{{old('txtentresta',isset($cat_domicilio_esta->entre )?$cat_domicilio_esta->entre :'')}}">
                <br>
                <label>Y Entre</label>
                <input class="form-control" type="text" id="txtyentresta" name="txtyentresta" maxlength="100" value="{{old('txtyentresta',isset($cat_domicilio_esta->yentre )?$cat_domicilio_esta->yentre :'')}}">
                <br>
                <label>Colonia</label>
                <input class="form-control" type="text" id="txtcoloniaesta" name="txtcoloniaesta" maxlength="100" value="{{old('txtcoloniaesta',isset($cat_domicilio_esta->colonia )?$cat_domicilio_esta->colonia :'')}}">
                <br>
                <label>Localidad</label> 
                <input class="form-control" type="text" id="txtlocalidadesta" name="txtlocalidadesta" maxlength="100" value="{{old('txtlocalidadesta',isset($cat_domicilio_esta->localidad )?$cat_domicilio_esta->localidad :'')}}"> 
                <br>
                <label>Delegacion</label> 
                <input class="form-control" type="text" id="txtdelegacionesta" name="txtdelegacionesta" maxlength="50" value="{{old('txtdelegacionesta',isset($datos->delegacion )?$datos->delegacion :'')}}"> 
                <br>
  
                <div class="form-group row">
                  <div class="form-group col-md-6">
                    <label>cp</label> 
                    <input class="form-control" type="text" id="txtcpesta" name="txtcpesta" maxlength="10" value="{{old('txtcpesta',isset($cat_domicilio_esta->cp )?$cat_domicilio_esta->cp :'')}}"> 
                  </div>
                  <div class="form-group col-md-6">
                    <label>Tipo de establecimiento</label>   
                    <select class="form-control" name="cbocat_establecimiento" id="cbocat_establecimiento">
                      <option value="{{ isset($cboinf_tipoesta->id_tipo_establecimiento)?$cboinf_tipoesta->id_tipo_establecimiento:'' }}"> {{ isset($cboinf_tipoesta->descripcion)?$cboinf_tipoesta->descripcion:'' }}</option>                        
                        @foreach($establecimientos as $establecimiento)
                          <option value="{{$establecimiento->id_tipo_establecimiento}}">{{$establecimiento->descripcion}}</option>
                        @endforeach
                    </select >
                  </div>
                </div>    
  
                <div class="form-group row">
                  <div class="form-group col-md-6">
                    <label>Giro solicitado (Catalogo SARE-SCIAN)</label>   
                    <select class="form-control" name="cbocat_giro" id="cbocat_giro">
                    <option value="{{ isset($cboinf_bajoimp->id_giro)?$cboinf_bajoimp->id_giro:'' }}">{{ isset($cboinf_bajoimp->descripcion)?$cboinf_bajoimp->descripcion:'' }}</option>                        
  
                        @foreach($giro_solicitado as $tipos_giros)
                        <option value="{{$tipos_giros->id_giro}}">{{$tipos_giros->descripcion}}</option>
                        @endforeach
                        
                    </select >
                  </div>
                  <div class="form-group col-md-6">
                    <label>Uso</label>   
                    <select class="form-control" name="cbocat_uso" id="cbocat_uso">
                        <option value="{{isset($solicitudesr->uso)?$solicitudesr->uso:''}}">{{isset($solicitudesr->uso)?$solicitudesr->uso:''}}</option>                        
                        <option value="BODEGA/INDUSTRIA">BODEGA/INDUSTRIA</option>
                        <option value="OFICINA">OFICINA</option>
                        <option value="COMERCIO">COMERCIO</option>
                        <option value="SERVICIO">SERVICIO</option>
                    </select>
                  </div>
                </div>  
  
                <label>Actividad principal</label> 
                <input class="form-control" type="text" id="txtactividadprincipal" name="txtactividadprincipal" maxlength="200" value="{{old('txtactividadprincipal',isset($datos->actividad_principal)?$datos->actividad_principal :'')}}"> 
                @error('txtactividadprincipal')
                    <div class="alert alert-danger" role="alert">
                        <small> {{$message}} </small>
                    </div>    
                  @enderror
                <br>
                <label>Actividad principal permitida</label> 
                <input class="form-control" type="text" id="txtactividadprincipalpermi" name="txtactividadprincipalpermi" maxlength="200" value="{{old('txtactividadprincipalpermi',isset($datos->actividad_principal_permitida)?$datos->actividad_principal_permitida :'')}}"> 
                <br>
  
                <div class="form-group row">
                  
                  <div class="form-group col-md-6">
                      <label>Horario autorizado para trabajar</label> 
                      <input class="form-control" type="text" id="txthorariotrab" name="txthorariotrab" maxlength="50" value="{{old('txthorariotrab',isset($datos->horario)?$datos->horario :'')}}"> 
                    </div>  
                    
                    <div class="form-group col-md-6">
                      <label>Inicio de operaciones</label> 
                      <input class="form-control" type="date" id="txtfechaoperaciones" name="txtfechaoperaciones" value="{{old('txtfechaoperaciones',isset($datos->inop_e)?$datos->inop_e :'')}}">
                    </div>
                    
                    <div class="form-group col-md-6">
                      <label>Capital en giro</label> 
                      <input class="form-control" type="text" id="txtcapitalgiro" name="txtcapitalgiro" maxlength="20" value="{{old('txtcapitalgiro',isset($datos->capital)?$datos->capital :'')}}"> 
                    </div>
                    
                    <div class="form-group col-md-6">
                      <label>numero de empleados</label> 
                      <input class="form-control" type="text" id="txtnoempleados" name="txtnoempleados" maxlength="11" value="{{old('txtnoempleados',isset($datos->num_empleados)?$datos->num_empleados :'')}}"> 
                    </div>
                    
                    <div class="form-group col-md-6">
                      <label>Hombres</label> 
                      <input class="form-control" type="text" id="txthombres" name="txthombres" value="{{old('txthombres',isset($solicitudesr->hombres)?$solicitudesr->hombres :'')}}"> 
                    </div>  
                    
                    <div class="form-group col-md-6">
                      <label>Mujeres</label> 
                      <input class="form-control" type="text" id="txtmujeres" name="txtmujeres" value="{{old('txtmujeres',isset($solicitudesr->mujeres)?$solicitudesr->mujeres :'')}}"> 
                    </div>
                    
                    <div class="form-group col-md-6">
                      
                      <label>Capacidades diferentes</label>
  
                      <fieldset id="grupopersona">
                        @if ($datos->capacidades=="1")
                          <input type="radio" name="optcapacidadesdiferentes" id="optoptcapdiferentesi"value="1" checked> SI
                          <input type="radio" name="optcapacidadesdiferentes" id="optcapdiferenteno" value="2"> NO
                          @else
                            <input type="radio" name="optcapacidadesdiferentes" id="optoptcapdiferentesi"value="1"> SI
                            <input type="radio" name="optcapacidadesdiferentes" id="optcapdiferenteno" value="2" checked> NO
                        @endif  
                      </fieldset>
  
                    </div>
                    
                    <div class="form-group col-md-6">
                      <label>No de pisos</label> 
                      <input class="form-control" type="number" id="txtnopisos" name="txtnopisos" value="{{old('txtnopisos',isset($datos->pisos )?$datos->pisos :'')}}"> 
                    </div>  
                    
                    <div class="form-group col-md-6">
                      <label>No de cajones</label> 
                      <input class="form-control" type="number" id="txtnocajones" name="txtnocajones" value="{{old('txtnocajones',isset($datos->num_cajones)?$datos->num_cajones :'')}}"> 
                    </div>
  
                    <div class="form-group col-md-6"> 
                      <label>Tipo de anuncio</label>   
                      <select class="form-control" name="cbotipo_anuncio" id="cbotipo_anuncio">
                        <option value="{{isset($solicitudesr->tipoanuncion)?$solicitudesr->tipoanuncion:''}}">{{isset($solicitudesr->tipoanuncion)?$solicitudesr->tipoanuncion:''}}</option>
                        <option value="NO">NO</option>
                        <option value="PINTADO/MURAL">PINTADO/MURAL</option>
                        <option value="ESTRUCTURAL">ESTRUCTURAL</option>
                        <option value="LUMINOSO">LUMINOSO</option>
                        <option value="OTRO">OTRO</option>
                      </select>
                    </div>
                </div>    
                
                <label>Leyenda del anuncio</label> 
                <input class="form-control" type="text" id="txtleyendaanuncio" name="txtleyendaanuncio" value="{{old('txtleyendaanuncio',isset($solicitudesr->leyendaa)?$solicitudesr->leyendaa :'')}}"> 
                
                <label>Lugar de instalacion del anuncio</label> 
                <input class="form-control" type="text" id="txtlugaranuncio" name="txtlugaranuncio" value="{{old('txtlugaranuncio',isset($solicitudesr->lugarinstalacion)?$solicitudesr->lugarinstalacion :'')}}"> 
                
                <br>
  
                <div class="form-group row">
                  <div class="form-group col-md-6">  
                    <label>Largo</label> 
                    <input class="form-control" type="text" id="txtlargo" name="txtlargo" value="{{old('txtlargo',isset($solicitudesr->largo_letrero)?$solicitudesr->largo_letrero :'')}}"> 
                  </div>  
                  <div class="form-group col-md-6">  
                    <label>Ancho</label> 
                    <input class="form-control" type="text" id="txtancho" name="txtancho" value="{{old('txtancho',isset($solicitudesr->ancho_letrero)?$solicitudesr->ancho_letrero :'')}}"> 
                  </div>
                </div>
                  
                <legend>Marque la causa legal por la que actualemente 
                  es poseedor del inmueble donde esta el establecimiento</legend>
  
                  <div class="form-group col-md-6">
                    <fieldset id="causalegal">            
  
                      @if ($datos->id_causa == 1)
                      
                        <input type="radio" onclick="oculta()" name="causalegal" id="1"  value="1" checked> Por ser propietario o copropietario, contando con escritura publica debidamente inscrita en el registro publico de la propiedad y del comercio, asi como tener la posicion del establecimiento.
                        <br>
                        <input type="radio" onclick="oculta()" name="causalegal" id="2"  value="2"> Por ser arrendatario contando con el contrato de arrendamiento vigente.
                        <br>
                        <input type="radio" onclick="oculta()" name="causalegal" id="3"  value="3"> por ser comodatario o tener el uso gratuito temporal de inmueble.
                        <br>
                        <input type="radio" onclick="muestra()" name="causalegal" id="4"  value="4"> Por otra causa especifique
                      
                      @endif
                      @if ($datos->id_causa == 2)
                      
                        <input type="radio" onclick="oculta()" name="causalegal" id="1"  value="1"> Por ser propietario o copropietario, contando con escritura publica debidamente inscrita en el registro publico de la propiedad y del comercio, asi como tener la posicion del establecimiento.  
                        <br>
                        <input type="radio" onclick="oculta()" name="causalegal" id="2"  value="2" checked> Por ser arrendatario contando con el contrato de arrendamiento vigente.
                        <br>
                        <input type="radio" onclick="oculta()" name="causalegal" id="3"  value="3"> por ser comodatario o tener el uso gratuito temporal de inmueble.
                        <br>
                        <input type="radio" onclick="muestra()" name="causalegal" id="4"  value="4"> Por otra causa especifique
                      
                      @endif
                      @if ($datos->id_causa == 3)
                      
                        <input type="radio" onclick="oculta()" name="causalegal" id="1"  value="1"> Por ser propietario o copropietario, contando con escritura publica debidamente inscrita en el registro publico de la propiedad y del comercio, asi como tener la posicion del establecimiento.  
                        <br>
                        <input type="radio" onclick="oculta()" name="causalegal" id="2"  value="2"> Por ser arrendatario contando con el contrato de arrendamiento vigente.  
                        <br>
                        <input type="radio" onclick="oculta()" name="causalegal" id="3"  value="3" checked> por ser comodatario o tener el uso gratuito temporal de inmueble.
                        <br>
                        <input type="radio" onclick="muestra()" name="causalegal" id="4"  value="4"> Por otra causa especifique
                      
                      @endif  
                      @if ($datos->id_causa == 4)
                      
                        <input type="radio" onclick="oculta()" name="causalegal" id="1"  value="1"> Por ser propietario o copropietario, contando con escritura publica debidamente inscrita en el registro publico de la propiedad y del comercio, asi como tener la posicion del establecimiento.  
                        <br>
                        <input type="radio" onclick="oculta()" name="causalegal" id="2"  value="2"> Por ser arrendatario contando con el contrato de arrendamiento vigente.  
                        <br>
                        <input type="radio" onclick="oculta()" name="causalegal" id="3"  value="3"> por ser comodatario o tener el uso gratuito temporal de inmueble.  
                        <br>
                        <input type="radio" onclick="muestra()" name="causalegal" id="4"  value="4" checked> Por otra causa especifique
                        
                      @endif  
                    
                    </fieldset>
                  </div>  
                  
                
                <div id="otracosa">
                  <label>Otra causa</label> 
                  <input class="form-control" type="text" id="txtotracausa" name="txtotracausa" value="{{old('txtotracausa',isset($datos->otra_causa)?$datos->otra_causa :'')}}"> 
                </div>
  
              </div>
  
            </div> 
            
            <div class="container p-3 my-3 border">
              <button class="btn btn-primary" onclick="return confirm('Desea actualizar la información?')" type="submit" form="Guardarefrendos" >
                  Actualizar
              </button>  
            </div>   
            
        </div>    

  </form>


<!-- Modal busca contribuyente -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
          
        <div class="container p-3 my-3 border">  
            <fieldset id="optBuscapor">
                  <div class="form-check form-check-inline">    
                    <input onchange="openCity(event, 'buscanombre')" type="radio" id ="optbuscapersona" name="optBuscapor" value="1" checked> Busca por persona
                  </div>
                  <div class="form-check form-check-inline">    
                    <input onchange="openCity(event, 'buscarfc')" type="radio" id="optbuscarfc" name="optBuscapor" value="2"> Busca por RFC
                  </div>
                  <div class="form-check form-check-inline">    
                    <input onchange="openCity(event, 'buscacurp')" type="radio" id="optbuscacurp" name="optBuscapor" value="3"> Busca por CURP
                  </div>  
            </fieldset>
              <br>
             <div id="buscanombre" class="tabcontent"> 
              <div class="form-group row">
                  <label class="form-group">Razon Social</label>
                  <div class="col-sm-10">
                    <input class="form-control" type="text" id="txtrazonsocial_modal" name="txtrazonsocial_modal">
                  </div>  
              </div> 
             </div>  

             <div id="buscarfc" class="tabcontent"> 
               <div class="form-row">
                  <label class="form-group">rfc</label>
                  <div class="col-sm-10">
                    <input class="form-control" type="text" id="txtrfc_modal" name="txtrfc_modal">
                  </div>  
              </div>
             </div>  

             <div id="buscacurp" class="tabcontent"> 
              <div class="form-row">
                  <label class="form-group">curp</label>
                  <div class="col-sm-10">
                    <input class="form-control" type="text" id="txtcurp_modal" name="txtcurp_modal">
                  </div>  
              </div>
             </div>  
        </div>

        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <table id ="tablacontri" class="table table-bordered table-hover ">
      <tr>
        <th class="small">ID</th>
        <th class="small">Nombre</th>
        <th class="small">Paterno</th>
        <th class="small">Materno</th>
        <th class="small">RFC</th>
        <th class="small">CURP</th>
        <th style = "display:none">tipo persona</th>
        <th style = "display:none">telefono</th>
        <th style = "display:none">celular</th>
      </tr>
  
      </table>

      </div>
      <div class="modal-footer">
        <h5 class="modal-title" id="exampleModalLabel">Busca contribuyente</h5>
        <button onclick="buscaporuc()" type="button" class="btn btn-primary">Buscar</button>  
        <button type="button" class="btn btn-secondary" data-dismiss="modal">cerrar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal busca domicilio notificar-->
<div class="modal fade" id="exampleModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <table id ="tabladomnoti" class="table table-bordered table-hover ">
      <tr>
        <th class="small">Calle</th>
        <th class="small">Entre</th>
        <th class="small">Yentre</th>
        <th class="small">Num Int</th>
        <th class="small">Num Ext</th>
        <th style = "display:none">Colonia</th>
        <th style = "display:none">Localidad</th>
        <th style = "display:none">CP</th>
      </tr>
  
      </table>

      </div>
      <div class="modal-footer">
        <h5 class="modal-title" id="exampleModalLabel">Busca contribuyente</h5>
        <button onclick="buscadom()" type="button" class="btn btn-primary">Buscar</button>  
        <button type="button" class="btn btn-secondary" data-dismiss="modal">cerrar</button>
      </div>
    </div>
  </div>
</div>


  @endsection   

<script>

let tipo_dom = "";   
let tipodomicilio="";
window.onload = iniciafecha;

function limpiatablacontri()
{

  iniciatabs();

  var nofilas=document.getElementById("tablacontri").rows.length;
    
    if (nofilas>1)
    {

      for (var fila=nofilas-1; fila > 1 ; fila-=1) {

        document.getElementById("tablacontri").deleteRow(fila);

      }

      document.getElementById("tablacontri").deleteRow(1);
      
    }

}


function limpiatabladom(tipo_domicilio)
{

  var nofilas=document.getElementById("tabladomnoti").rows.length;
    
    if (nofilas>1)
    {

      for (var fila=nofilas-1; fila > 1 ; fila-=1) {

        document.getElementById("tabladomnoti").deleteRow(fila);

      }

      document.getElementById("tabladomnoti").deleteRow(1);
      
    }

    tipo_dom = tipo_domicilio;

}

function openCity(evt, cityName) 
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
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function iniciatabs()
{
          
    var i, tabcontent;
   
    tabcontent = document.getElementsByClassName("tabcontent");
    
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tabcontent[0].style.display = "block";

    document.getElementsByClassName("optbuscapersona").cheked=true;
    
}

function buscaporuc()
{

    var busca="";
    var quien_busca=0;
    
    if (document.getElementById('optbuscapersona').checked )
      {
        busca = document.getElementById('txtrazonsocial_modal').value;
        quien_busca=1;
      }

      if(document.getElementById('optbuscarfc').checked)
      {
        busca = document.getElementById('txtrfc_modal').value;
        quien_busca=2;
        
      }
      if(document.getElementById('optbuscacurp').checked)
      
      {
        busca = document.getElementById('txtcurp_modal').value;
        quien_busca=3;
        
      }    

/*  id puc para buscar las direcciones*/
    axios.get('buscauc', {
          params: {
            buscados: busca,
            quienbusca: quien_busca
          }
        })
        .then(function (response) {
          
        for (var i = 0; i < response.data.length; i+=1) 
        {
          var tr = `<tr ondblclick="seleccionaTe(this)">
            <td>`+ response.data[i].id_puc + `</td> 
            <td class="small">`+ response.data[i].nombre + `</td>
            <td class="small">` + response.data[i].apellido1 + `</td>
            <td class="small">` + response.data[i].apellido2 + `</td>
            <td class="small">` + response.data[i].rfc + `</td>
            <td class="small">` + response.data[i].curp + `</td>
            <td style = "display:none">` + response.data[i].tipo_persona + `</td>
            <td style = "display:none">` + response.data[i].telefono + `</td>
            <td style = "display:none">` + response.data[i].celular + `</td>
          </tr>`;
          
          
          $('#tablacontri tr:last').after(tr);
        }

        if (0 == response.data.length)
          {
            alert("ESTE CONTRIBUYENTE NO ESTA DADO DE ALTA")
          }

    });
    
}

function seleccionaTe(x) 
{
  
  var table = document.getElementById("tablacontri");
  
  document.getElementById('txtidpuc').value=table.rows[x.rowIndex].cells[0].innerHTML;
  document.getElementById('txtrazonsocial').value=table.rows[x.rowIndex].cells[1].innerHTML;
  document.getElementById('txtApellidoPaterno').value=table.rows[x.rowIndex].cells[2].innerHTML;
  document.getElementById('txtApellidoMaterno').value=table.rows[x.rowIndex].cells[3].innerHTML;
  
  document.getElementById('txtrfc').value=table.rows[x.rowIndex].cells[4].innerHTML;
  document.getElementById('txtcurp').value=table.rows[x.rowIndex].cells[5].innerHTML;
    
  if (table.rows[x.rowIndex].cells[6].innerHTML=="FISICA")
  {
    document.getElementById('optpersonafisica').checked = true
  }
  if (table.rows[x.rowIndex].cells[6].innerHTML=="MORAL")
  {
    document.getElementById('optpersonamoral').checked = true
  }

  document.getElementById('txttel').value=table.rows[x.rowIndex].cells[7].innerHTML;
  document.getElementById('txtcel').value=table.rows[x.rowIndex].cells[8].innerHTML;
  
  document.getElementById('btn_bus_dom_noti').disabled = false;
  document.getElementById('btn_bus_dom_esta').disabled = false;
  document.getElementById('btn_bus_dom').disabled = false;
  
} 

function buscadom()
{

  var calle_temp="";
  var entre_temp="";
  var yentre_temp="";
  var colonia_temp="";
  var localidad_temp="";
  
  //por funcion limpia tabla que borra la variable
  tipodomicilio = tipo_dom;

  var idpuc = document.getElementById('txtidpuc').value

   limpiatabladom();

  axios.get('busdomnoti', {
          params: {
            id_puc: idpuc,
            tipo_domicilio: tipodomicilio
          }
        })
        .then(function (response) {
  
          for (var i = 0; i < response.data.length; i+=1) 
          {
            if (response.data[i].calle == null)
            {
              calle_temp = response.data[i].rcalle;   
            }else
              {
                calle_temp = response.data[i].calle; 
              }

              if (response.data[i].entre == null)
            {
              entre_temp = response.data[i].rentre;   
            }else
              {
                entre_temp = response.data[i].entre; 
              }

              if (response.data[i].yentre == null)
            {
              yentre_temp = response.data[i].ryentre;   
            }else
              {
                yentre_temp = response.data[i].yentre; 
              }
            //estado,municipi,localidad, colopnioa
            if (response.data[i].localidad == null)
            {
              localidad_temp = response.data[i].rlocalidad;   
            }else
              {
                localidad_temp = response.data[i].localidad; 
              }

              if (response.data[i].colonia == null)
            {
              colonia_temp = response.data[i].rcolonia;   
            }else
              {
                colonia_temp = response.data[i].colonia; 
              }
              
            var tr = `<tr ondblclick="seleccionaDom(this)">
              <td class="small">`+ calle_temp + `</td>
              <td class="small">` + entre_temp + `</td>
              <td class="small">` + yentre_temp + `</td>
              <td class="small">` + response.data[i].numint + `</td>
              <td class="small">` + response.data[i].numext + `</td>
              <td style = "display:none">` + colonia_temp + `</td>
              <td style = "display:none">` + localidad_temp + `</td>
              <td style = "display:none">` + response.data[i].cp + `</td>
            </tr>`;
            
            $('#tabladomnoti tr:last').after(tr);
          }
        
          if (0 == response.data.length)
          {
            console.log(response.data);   
            alert("ESTE CONTRIBUYENTE NO TIENE INFORMACION")

          }

    });

}

function seleccionaDom(x) 
{
  
  var table = document.getElementById("tabladomnoti");
  
  //alert(tipodomicilio)
  if (tipodomicilio=="NORMAL")
  {
    document.getElementById('txtcalle').value=table.rows[x.rowIndex].cells[0].innerHTML;
    document.getElementById('txtentre').value=table.rows[x.rowIndex].cells[1].innerHTML;
    document.getElementById('txtyentre').value=table.rows[x.rowIndex].cells[2].innerHTML;
    
    document.getElementById('txtnoint').value=table.rows[x.rowIndex].cells[3].innerHTML;
    document.getElementById('txtNoExt').value=table.rows[x.rowIndex].cells[4].innerHTML;

    document.getElementById('txtcolonia').value=table.rows[x.rowIndex].cells[5].innerHTML;
    document.getElementById('txtlocalidad').value=table.rows[x.rowIndex].cells[6].innerHTML;

    document.getElementById('txtcp').value=table.rows[x.rowIndex].cells[7].innerHTML;
    
  }

  if (tipodomicilio=="NOTIFICAR")
  {
    document.getElementById('txtcallenoti').value=table.rows[x.rowIndex].cells[0].innerHTML;
    document.getElementById('txtentrenoti').value=table.rows[x.rowIndex].cells[1].innerHTML;
    document.getElementById('txtyentrenoti').value=table.rows[x.rowIndex].cells[2].innerHTML;

    document.getElementById('txtnointnoti').value=table.rows[x.rowIndex].cells[3].innerHTML;
    document.getElementById('txtnoextnoti').value=table.rows[x.rowIndex].cells[4].innerHTML;
      
    document.getElementById('txtcolonianoti').value=table.rows[x.rowIndex].cells[5].innerHTML;
    document.getElementById('txtlocalidadnoti').value=table.rows[x.rowIndex].cells[6].innerHTML;

    document.getElementById('txtcpnoti').value=table.rows[x.rowIndex].cells[7].innerHTML;
    
  }

  if (tipodomicilio=="ESTABLECIMIENTO")
  {
    document.getElementById('txtcallesta').value=table.rows[x.rowIndex].cells[0].innerHTML;
    document.getElementById('txtentresta').value=table.rows[x.rowIndex].cells[1].innerHTML;
    document.getElementById('txtyentresta').value=table.rows[x.rowIndex].cells[2].innerHTML;
  
    document.getElementById('txtcoloniaesta').value=table.rows[x.rowIndex].cells[5].innerHTML;
    document.getElementById('txtlocalidadesta').value=table.rows[x.rowIndex].cells[6].innerHTML;

    document.getElementById('txtcpesta').value=table.rows[x.rowIndex].cells[7].innerHTML;
    
  }

} 

function iniciafecha()
{
    
    document.getElementById("txtfecha").valueAsDate = new Date();
    document.getElementById('txtfecharefrendo').value = new Date().getFullYear();
    document.getElementById("txtfechaoperaciones").valueAsDate = new Date();
    document.getElementById("otracosa").style.visibility = "hidden";
    
}

function muestra()
{
  document.getElementById("otracosa").style.visibility = "visible";
}

function oculta()
{
  document.getElementById("otracosa").style.visibility = "hidden";
}

function BuscaGiroCom(idgirocomercial)
{

  
  $("#cbocat_giro").empty();

    axios.get('buscagirocom', {
          params: {
            idgiro_com: idgirocomercial            
          }
        })
        .then(function (response) {
          console.log(response.data);             
        for (var i = 0; i < response.data.length; i+=1) 
        {
         
          $('#cbocat_giro').append("<option value='"+ response.data[i].id_giro +"'>"+ response.data[i].descripcion + "</option>");
          
        }
    });
    
}

</script>
