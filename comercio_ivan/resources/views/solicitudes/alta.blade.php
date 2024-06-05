
@extends('layouts.app')


@section('content')

<form action= "{{ url('/solicitudes') }}" method="post" id="Guardaalta">
   
  @csrf

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

    <h3 >Solicitud de licencia</h3>
    <div class="container p-3 my-3 border">
    <h3 >Datos generales del solicitante</h3>  
    <div class="container p-3 my-3 border">
      
      <input id="txtidpuc" name="txtidpuc" type="hidden">
      <div class="form-group row">
              <div class="form-group col-md-4">
                <label>Fecha del registro </label>
                <input readonly type="date" id="txtfecha" name="txtfecha">
              </div>    
      
              <div class="form-group col-md-4">
                <label>Tipo de negocio</label>   
                  <div class="col-sm-10">
                  
                      <select class="form-control" name="cbocat_negocios" id="cbocat_negocios" onchange="BuscaGiroCom(this.value)">
                      <option value="0">Seleccione el Tipo de Negocio</option>
                      @foreach($negocios as $negocio)    
                        <option value="{{$negocio->cv_tipo_negocio}}">{{$negocio->descripcion}}</option>
                      @endforeach  
                    </select > 
                    
                  </div>   
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
          <input class="form-control" type="text" id="txtrazonsocial" name="txtrazonsocial" maxlength="100" value="{{old('txtrazonsocial')}}">
            @error('txtrazonsocial')
              <div class="alert alert-danger" role="alert">
                  <small> {{$message}} </small>
                  </div>    
            @enderror
          <br>
          <label>Apellido Paterno</label>
          <input class="form-control" type="text" id="txtApellidoPaterno" name="txtApellidoPaterno" maxlength="50" value="{{old('txtApellidoPaterno')}}">
          <br>
          <label>Apellido Materno</label>
          <input class="form-control" type="text" id="txtApellidoMaterno" name="txtApellidoMaterno" maxlength="50" value="{{old('txtApellidoMaterno')}}">
          <br>

          <label>Calle</label>
          <input class="form-control" type="text" id="txtcalle" name="txtcalle" maxlength="100" value="{{old('txtcalle')}}">
          @error('txtcalle')
              <div class="alert alert-danger" role="alert">
                  <small> {{$message}} </small>
                  </div>    
            @enderror
          <br>

          <label>Entre</label>
          <input class="form-control" type="text" id="txtentre" name="txtentre" maxlength="100" value="{{old('txtentre')}}">
          <br>
          <label>Y Entre</label>
          <input class="form-control" type="text" id="txtyentre" name="txtyentre" maxlength="100" value="{{old('txtyentre')}}">

          <br>
          <div class="form-group row">
            <div class="form-group col-md-6">
              <label>NO Interior</label>
              <input class="form-control" type="text" id="txtnoint" name="txtnoint" maxlength="5" value="{{old('txtnoint')}}">
            </div>    
            <div class="form-group col-md-6">
              <label>NO Exterior</label>
              <input class="form-control" type="text" id="txtNoExt" name="txtNoExt" maxlength="5" value="{{old('txtNoExt')}}">
            </div>    
          </div>
          
          <label>Colonia</label>
          <input class="form-control" type="text" id="txtcolonia" name="txtcolonia" maxlength="100" value="{{old('txtcolonia')}}">
          <br>
          <label>Localidad</label>
          <input class="form-control" type="text" id="txtlocalidad" name="txtlocalidad" maxlength="100" value="{{old('txtlocalidad')}}">
          <br>

          <div class="form-group row">
            <div class="form-group col-md-6">
              <label>Codigo Postal</label>
              <input class="form-control" type="text" id="txtcp" name="txtcp" maxlength="10" value="{{old('txtcp')}}">
            </div>
            <div class="form-group col-md-6">
              <label>Telefono</label>
              <input class="form-control" type="text" id="txttel" name="txttel" maxlength="20" value="{{old('txttel')}}">
            </div>
            <div class="form-group col-md-6">
              <label>Celular</label>
              <input class="form-control" type="text" id="txtcel" name="txtcel" maxlength="20" value="{{old('txtcel')}}">
            </div>  
            <div class="form-group col-md-6">
              <label>CURP</label>
              <input class="form-control" type="text" id="txtcurp" name="txtcurp" maxlength="30" value="{{old('txtcurp')}}">
            </div>  
            <div class="form-group col-md-6">
              <label>RFC</label>
              <input class="form-control" type="text" id="txtrfc" name="txtrfc" maxlength="40" value="{{old('txtrfc')}}">
            </div>  
            <div class="form-group col-md-6">
              <label>No de Credencial</label>
              <input class="form-control" type="text" id="txtnocredencial" name="txtnocredencial" maxlength="50" value="{{old('txtnocredencial')}}">
            </div>  
          </div> 

          <label>Organismo o Asociación</label> 
          <select class="form-control" name="cbocat_camaras" id="cbocat_camaras">
            @foreach($camaras as $camara)
            <option value="{{$camara->id_cat_camara}}">{{$camara->descripcion}}</option>
            @endforeach
          </select >
          <br>
          <div class="btn-group" role="group">
            <!-- Button trigger modal -->
            <button onclick="limpiatablacontri()" type="button" class="btn btn-primary" data-toggle="modal" data-target="#ventana1">
              BUSCA CONTRIBUYEN
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
        <br>
        <label>Calle</label>
        <input class="form-control" type="text" id="txtcallenoti" name="txtcallenoti" maxlength="100" value="{{old('txtcalleoti')}}">
        @error('txtcallenoti')
        <div class="alert alert-danger" role="alert">
          <small> {{$message}} </small>
        </div>    
        @enderror
        <br>
        <label>Entre</label>
        <input class="form-control" type="text" id="txtentrenoti" name="txtentrenoti" maxlength="100" value="{{old('txtentrenoti')}}">
        <br>
        <label>Y Entre</label>
        <input class="form-control" type="text" id="txtyentrenoti" name="txtyentrenoti" maxlength="100" value="{{old('txtyentrenoti')}}">
        <br>

        <div class="form-group row">
          <div class="form-group col-md-6">
            <label>No Interior</label>
            <input class="form-control" type="text" id="txtnointnoti" name="txtnointnoti" maxlength="5" value="{{old('txtnointnoti')}}">
          </div>
          <div class="form-group col-md-6">
            <label>No Exterior</label>
            <input class="form-control" type="text" id="txtnoextnoti" name="txtnoextnoti" maxlength="5" value="{{old('txtnoextnoti')}}">
          </div>
        </div>

        <label>Colonia</label>
        <input class="form-control" type="text" id="txtcolonianoti" name="txtcolonianoti" maxlength="100" value="{{old('txtcolonianoti')}}">
        <br>
        <label>Localidad</label> 
        <input class="form-control" type="text" id="txtlocalidadnoti" name="txtlocalidadnoti" maxlength="100" value="{{old('txtlocalidadnoti')}}"> 
        <br>

        <div class="form-group col-md-6">
          <label>cp</label> 
          <input class="form-control" type="text" id="txtcpnoti" name="txtcpnoti" maxlength="10" value="{{old('txtcpnoti')}}"> 
        </div>
        <br>

        <div class="form-group row">
          <div class="form-group col-md-6">
            <label>Telefono</label>
            <input class="form-control" type="text" id="txttelnoti" name="txttelnoti" maxlength="20" value="{{old('txttelnoti')}}">
          </div>
          <div class="form-group col-md-6">
            <label>Celular</label>
            <input class="form-control" type="text" id="txtcelnoti" name="txtcelnoti" maxlength="20" value="{{old('txtcelnoti')}}">
          </div>
        </div>  

        <br>
        <label>Nombre del representante legal</label>
        <input class="form-control" type="text" id="txtreprelegalnoti" name="txtreprelegalnoti" maxlength="100" value="{{old('txtreprelegalnoti')}}">
        <br>
        <div class="form-group col-md-6">
          <label>Telefono Rep Legal</label>
          <input class="form-control" type="text" id="txtreprelegaltelnoti" name="txtreprelegaltelnoti" maxlength="20" value="{{old('txtreprelegaltelnoti')}}">
        </div>  
        <br>

        <div class="form-group row">
          <div class="form-group col-md-6">
            <label>Celular Rep Legal</label>
            <input class="form-control"type="text" id="txtreprelegalcelnoti" name="txtreprelegalcelnoti" maxlength="20" value="{{old('txtreprelegalcelnoti')}}">
          </div>  
          <div class="form-group col-md-6">
            <label>Correo Rep Legal</label>
            <input class="form-control" type="text" id="txtreprelegalcorreonoti" name="txtreprelegalcorreonoti" maxlength="50" value="{{old('txtreprelegalcorreonoti')}}">
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
          <br>

          <label>Nombre del establecimiento</label>
          <input class="form-control" type="text" id="txtnombrestable" name="txtnombrestable" maxlength="100" value="{{old('txtnombrestable')}}">
          @error('txtnombrestable')
              <div class="alert alert-danger" role="alert">
                  <small> {{$message}} </small>
              </div>    
            @enderror
          <br>

          <div class="form-group row">

            <div class="form-group col-md-4">
              <label>clave catastral</label>
              <input class="form-control" type="text" id="txtclavecata" name="txtclavecata" maxlength="25" value="{{old('txtclavecata')}}">
            </div>
            <div class="form-group col-md-4">        
              <label>Folio catastral</label>
              <input class="form-control" type="text"id="txtfoliocata" name="txtfoliocata" maxlength="10" value="{{old('txtfoliocata')}}"> 
              @error('txtrazonsocial')
                  <div class="alert alert-danger" role="alert">
                    <small> {{$message}} </small>
                  </div>    
              @enderror
            </div>
            <div class="form-group col-md-4">  
              <label>Tipo de predio</label>
              <fieldset id="grupopredio">
                <input type="radio" id="opturbana" name="opttipopre" value="U" checked> Urbana
                <input type="radio" id="optrustica" name="opttipopre" value="R"> Rustica
                <input type="radio" id="optsuburbana" name="opttipopre" value="S"> Suburbana
                <input type="radio" id="optespecial" name="opttipopre" value="E"> Especial
              </fieldset>
              <button onclick="BuscaPredial()" type="button" class="btn btn-secondary">
                Checa predial
              </button>  

            </div>  

          </div>    
          
          <div class="form-group row">
            <div class="form-group col-md-6">
              <label>Superficie del local</label>
              <input class="form-control" type="number" id="txtsuplocal" name="txtsuplocal" value="{{old('txtsuplocal')}}"> 
            </div>
            <div class="form-group col-md-6">
              <label>No de registro del S.S.A</label>
              <input class="form-control" type="text" id="txtregistrossa" name="txtregistrossa" maxlength="50" value="{{old('txtregistrossa')}}"> 
            </div>
          </div>


          <label>Calle</label>
          <input class="form-control" type="text" id="txtcallesta" name="txtcallesta" maxlength="100" value="{{old('txtcallesta')}}">
          @error('txtcallesta')
              <div class="alert alert-danger" role="alert">
                  <small> {{$message}} </small>
              </div>    
            @enderror
          <br>
          <label>Entre</label>
          <input class="form-control" type="text" id="txtentresta" name="txtentresta" maxlength="100" value="{{old('txtentresta')}}">
          <br>
          <label>Y Entre</label>
          <input class="form-control" type="text" id="txtyentresta" name="txtyentresta" maxlength="100" value="{{old('txtyentresta')}}">
          <br>
          <label>Colonia</label>
          <input class="form-control" type="text" id="txtcoloniaesta" name="txtcoloniaesta" maxlength="100" value="{{old('txtcoloniaesta')}}">
          <br>
          <label>Localidad</label> 
          <input class="form-control" type="text" id="txtlocalidadesta" name="txtlocalidadesta" maxlength="100" value="{{old('txtlocalidadesta')}}"> 
          <br>
          <label>Delegacion</label> 
          <input class="form-control" type="text" id="txtdelegacionesta" name="txtdelegacionesta" maxlength="50" value="{{old('txtdelegacionesta')}}"> 
          <br>

          <div class="form-group row">
            <div class="form-group col-md-6">
              <label>cp</label> 
              <input class="form-control" type="text" id="txtcpesta" name="txtcpesta" maxlength="10" value="{{old('txtcpesta')}}"> 
            </div>
            <div class="form-group col-md-6">
              <label>Tipo de establecimiento</label>   
              <select class="form-control" name="cbocat_establecimiento" id="cbocat_establecimiento">
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
                
                  <option value=""></option>
                
              </select >

            </div>
            <div class="form-group col-md-6">
              <label>Uso</label>   
              <select class="form-control" name="cbocat_uso" id="cbocat_uso">
                <option value="BODEGA/INDUSTRIA">BODEGA/INDUSTRIA</option>
                <option value="OFICINA">OFICINA</option>
                <option value="COMERCIO">COMERCIO</option>
                <option value="SERVICIO">SERVICIO</option>
              </select>
            </div>
          </div>  

          <label>Actividad principal</label> 
          <input class="form-control" type="text" id="txtactividadprincipal" name="txtactividadprincipal" maxlength="200" value="{{old('txtactividadprincipal')}}"> 
          @error('txtactividadprincipal')
              <div class="alert alert-danger" role="alert">
                  <small> {{$message}} </small>
              </div>    
            @enderror
          <br>
          <label>Actividad principal permitida</label> 
          <input class="form-control" type="text" id="txtactividadprincipalpermi" name="txtactividadprincipalpermi" maxlength="200" value="{{old('txtactividadprincipalpermi')}}"> 
          <br>

          <div class="form-group row">
            
            <div class="form-group col-md-6">
                <label>Horario autorizado para trabajar</label> 
                <input class="form-control" type="text" id="txthorariotrab" name="txthorariotrab" maxlength="50" value="{{old('txthorariotrab')}}"> 
              </div>  
              
              <div class="form-group col-md-6">
                <label>Inicio de operaciones</label> 
                <input class="form-control" type="date" id="txtfechaoperaciones" name="txtfechaoperaciones" value="{{old('txtfechaoperaciones')}}">
              </div>
              
              <div class="form-group col-md-6">
                <label>Capital en giro</label> 
                <input class="form-control" type="text" id="txtcapitalgiro" name="txtcapitalgiro" maxlength="20" value="{{old('txtcapitalgiro')}}"> 
              </div>
              
              <div class="form-group col-md-6">
                <label>numero de empleados</label> 
                <input class="form-control" type="text" id="txtnoempleados" name="txtnoempleados" maxlength="11" value="{{old('txtnoempleados')}}"> 
              </div>
              
              <div class="form-group col-md-6">
                <label>Hombres</label> 
                <input class="form-control" type="text" id="txthombres" name="txthombres" value="{{old('txthombres',isset($datos->hombres )?$datos->hombres :'')}}"> 
              </div>  
              
              <div class="form-group col-md-6">
                <label>Mujeres</label> 
                <input class="form-control" type="text" id="txtmujeres" name="txtmujeres" value="{{old('txtmujeres',isset($datos->mujeres )?$datos->mujeres :'')}}"> 
              </div>
              
              <div class="form-group col-md-6">
                
                <label>Capacidades diferentes</label>
                <fieldset id="grupopersona">
                  <input type="radio" name="optcapacidadesdiferentes" id="optoptcapdiferentesi"value="1" checked> SI
                  <input type="radio" name="optcapacidadesdiferentes" id="optcapdiferenteno" value="2"> NO
                </fieldset>

              </div>
              
              <div class="form-group col-md-6">
                <label>No de pisos</label> 
                <input class="form-control" type="number" id="txtnopisos" name="txtnopisos" value="{{old('txtnopisos',isset($datos->pisos )?$datos->pisos :'')}}"> 
              </div>  
              
              <div class="form-group col-md-6">
                <label>No de cajones</label> 
                <input class="form-control" type="number" id="txtnocajones" name="txtnocajones" value="{{old('txtnocajones',isset($datos->num_cajones )?$datos->num_cajones :'')}}"> 
              </div>

              <div class="form-group col-md-6"> 
                <label>Tipo de anuncio</label>   
                <select class="form-control" name="cbotipo_anuncio" id="cbotipo_anuncio">
                  <option value="NO">NO</option>
                  <option value="PINTADO/MURAL">PINTADO/MURAL</option>
                  <option value="ESTRUCTURAL">ESTRUCTURAL</option>
                  <option value="LUMINOSO">LUMINOSO</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>
          </div>    
          
          <label>Leyenda del anuncio</label> 
          <input class="form-control" type="text" id="txtleyendaanuncio" name="txtleyendaanuncio" value="{{old('txtleyendaanuncio')}}"> 
          
          <label>Lugar de instalacion del anuncio</label> 
          <input class="form-control" type="text" id="txtlugaranuncio" name="txtlugaranuncio" value="{{old('txtlugaranuncio')}}"> 
          
          <br>

          <div class="form-group row">
            <div class="form-group col-md-6">  
              <label>Largo</label> 
              <input class="form-control" type="text" id="txtlargo" name="txtlargo" value="{{old('txtlargo')}}"> 
            </div>  
            <div class="form-group col-md-6">  
              <label>Ancho</label> 
              <input class="form-control" type="text" id="txtancho" name="txtancho" value="{{old('txtancho')}}"> 
            </div>
          </div>
            
          <legend>Marque la causa legal por la que actualemente 
            es poseedor del inmueble donde esta el establecimiento</legend>

          <div class="form-group col-md-6">
            <fieldset id="causalegal">
                <input type="radio" onclick="oculta()" name="causalegal" id="1"  value="1" checked> Por ser propietario o copropietario, contando con escritura publica debidamente inscrita en el registro publico de la propiedad y del comercio, asi como tener la posicion del establecimiento.
                <br>
                <input type="radio" onclick="oculta()" name="causalegal" id="2"  value="2"> Por ser arrendatario contando con el contrato de arrendamiento vigente.
                <br>
                <input type="radio" onclick="oculta()" name="causalegal" id="3"  value="3"> por ser comodatario o tener el uso gratuito temporal de inmueble.
                <br>
                <input type="radio" onclick="muestra()" name="causalegal" id="4"  value="4"> Por otra causa especifique
            </fieldset>
          </div>
          
          <div id="otracosa">
            <label>Otra causa</label> 
            <input class="form-control" type="text" id="txtotracausa" name="txtotracausa" value="{{old('txtotracausa')}}"> 
          </div>

        </div>

        <input class="form-control" type="hidden" id="txtlat" name="txtlat" value="{{isset($datos->lat)?$datos->lat :0}}"> 
        <input class="form-control" type="hidden" id="txtlng" name="txtlng" value="{{isset($datos->lng)?$datos->lng :0}}"> 

        <div class="form-group row" id="map" style="height:600px; width: 1000px;" ></div>
  
    </div> 
      
    <div class="container p-3 my-3 border">
      <button id="guarda_solicitud" onclick="return confirm('Quieres Guardar el registro?')" class="btn btn-primary" type="submit" form="Guardaalta">
        guardar
      </button>  
     
      <a class="btn btn-info" href="{{ url('/solicitudes') }}" role="button">
        REGRESA
      </a>    

    </div>   

  </div>

</form>

<!-- Modal busca contribuyente -->
<div class="modal fade" id="ventana1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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

<!-- Modal busca domicilio-->
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
        <h5 class="modal-title" id="exampleModalLabel">Busca Domicilio</h5>
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
let map;

function initMap() {
map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 24.14266563975116, lng: -110.30185489206237 },
    zoom: 12,
    scrollwheel: true,
});
const uluru = { lat: 24.14266563975116, lng: -110.30185489206237 };
let marker = new google.maps.Marker({
    position: uluru,
    map: map,
    draggable: true
});
google.maps.event.addListener(marker,'position_changed',
    function (){
        let lat = marker.position.lat()
        let lng = marker.position.lng()
        $('#txtlat').val(lat)
        $('#txtlng').val(lng)
    })
google.maps.event.addListener(map,'click',
function (event){
    pos = event.latLng
    marker.setPosition(pos)
})

}

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

    buscadom(tipo_domicilio);

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


    axios.get('buscauc', {
          params: {
            buscados: busca,
            quienbusca: quien_busca
          }
        })
        .then(function (response) {
          console.log(response.data);             
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



function buscadom(tipo_domicilio)
{

  var calle_temp="";
  var entre_temp="";
  var yentre_temp="";
  var colonia_temp="";
  var localidad_temp="";
  
  var idpuc = document.getElementById('txtidpuc').value

  axios.get('busdomnoti', {
          params: {
            id_puc: idpuc,
            tipo_domicilio: tipo_domicilio
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
              <td style = "display:none">` + tipo_domicilio + `</td>
            </tr>`;
            
            $('#tabladomnoti tr:last').after(tr);
          }
        
          if (0 == response.data.length)
          {
            alert("ESTE CONTRIBUYENTE NO TIENE INFORMACION")

          }

    });

}



function seleccionaDom(x) 
{
  
  var table = document.getElementById("tabladomnoti");
  
  if (table.rows[x.rowIndex].cells[8].innerHTML == "NORMAL")
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



  if (table.rows[x.rowIndex].cells[8].innerHTML == "NOTIFICAR")
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

  if (table.rows[x.rowIndex].cells[8].innerHTML == "ESTABLECIMIENTO")
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

function BuscaPredial()
{
  var folio_predio = "";
  var tipo_predio ="";
  
  if (document.getElementById('opturbana').checked )
      {tipo_predio="U";}
  if (document.getElementById('optrustica').checked )
      {tipo_predio="R";}
  if (document.getElementById('optsuburbana').checked )
      {tipo_predio="S";}
  if (document.getElementById('optespecial').checked )
      {tipo_predio="E";}

  folio_predio = document.getElementById('txtfoliocata').value;    

  axios.get('busca_predial1', {
          params: {
            t_predio: tipo_predio,
            f_predio: folio_predio
          }
        })
        .then(function (response) {
          
          console.log(response.data);
          if (response.data == "pagado")
          {
            alert("El predial esta pagado")
            $('#guarda_solicitud').prop('disabled', false);
          }
          
          if (response.data == "nopagado")
              {
                alert("El predial no esta pagado")
                $('#guarda_solicitud').prop('disabled', true);

              }

              if (response.data == "noexiste")
              {
                alert("El predio no existe")
                $('#guarda_solicitud').prop('disabled', true);

              }    


        
    });

}

</script>


