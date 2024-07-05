<table style=" table-layout: fixed;">
    <tr>
        <th {!!$estiloEncabezado!!}>Trámite ID</th>
        <th {!!$estiloEncabezado!!}>Nombre del Comercio</th>
        <th {!!$estiloEncabezado!!}>Nombre del Propietario</th>
        <th {!!$estiloEncabezado!!}>Fecha Inicio Trámite</th>
        <th {!!$estiloEncabezado!!}>Teléfono</th>
        <th {!!$estiloEncabezado!!}>Giros</th>
        <th {!!$estiloEncabezado!!}>Impacto Giro</th>
        <th {!!$estiloEncabezado!!}>Venta Alcohol</th>
        @if($entidad_revision==5)
            <th {!!$estiloEncabezado!!}>Clave Catastral</th>
        @endif
        <th {!!$estiloEncabezado!!}>Dirección</th>
        <th {!!$estiloEncabezado!!}>CP</th>
        <th {!!$estiloEncabezado!!}>Colonia</th>
        <th {!!$estiloEncabezado!!}>Delegación</th>
        <th {!!$estiloEncabezado!!}>Latitud</th>
        <th {!!$estiloEncabezado!!}>Longitud</th>
        <th {!!$estiloEncabezado!!}>Tamaño Empresa</th>
        <th {!!$estiloEncabezado!!}>Horario</th>
        <th {!!$estiloEncabezado!!}>Superficie M2</th>
        <th {!!$estiloEncabezado!!}>Emisión de Licencia</th>
        <th {!!$estiloEncabezado!!}>Nombre </th>
        <th {!!$estiloEncabezado!!}>Apellidos </th>
        <th {!!$estiloEncabezado!!}>RFC </th>
        <th {!!$estiloEncabezado!!}>CURP</th>
        <th {!!$estiloEncabezado!!}>Régimen Fiscal </th>
        @if($entidad_revision!=5)
            <th {!!$estiloEncabezado!!}>Fecha Aviso de Entero</th>
            <th {!!$estiloEncabezado!!}>Hora Aviso de Entero</th>
            <th {!!$estiloEncabezado!!}>Estado Aviso </th>
            <th {!!$estiloEncabezado!!}>Monto </th>
        @endif

    </tr>
    @foreach($negocios as $negocio)
        <tr>
        <td>{{$negocio->tramitesPadres->first()->id}}</td>
        <td>{{$negocio->nombre_del_negocio}}</td>
        <td>{{$negocio->propietario}}</td>
        <td>{{$negocio->tramitesPadres->first()->fecha}}</td>
        <td>{{$negocio->telefono}} </td>
        <td>
            @foreach ($negocio->giro_comercial as $giro)
            {{$giro->nombre}}|
            @endforeach
        </td>
        <td>{{$negocio->impacto_giro_comercial=='bajo_impacto'?'BAJO IMPACTO' : 'ALTO IMPACTO'}}</td>
        <td>{{$negocio->venta_alcohol==true?'SI':'NO'}}</td>
        @if($entidad_revision==5)
            <td>{{$negocio->clave_catastral}}</td>
        @endif
        <td>{{$negocio->direccion_completa}}</td>
        <td>{{$negocio->direccion->codigo_postal}}</td>
        <td>{{$negocio->direccion->colonia->nombre_localidad}} </td>
        <td>{{$negocio->direccion->delegacion}} </td>
        <td>{{$negocio->direccion->latitud }}</td>
        <td>{{$negocio->direccion->longitude}}</td>
        <td>{{$negocio->tamano_empresa}}</td>
        <td>{{$negocio->horarios}}</td>
        <td>{{$negocio->superficie_m2}}</td>
        <td>{{$negocio->resolutivos->where('entidad_revisora_id', 5)->first()==null?'En trámite':'Activa'}}</td>
        @if($negocio->persona_moral!=null)
        <td>{{$negocio->persona_moral->nombre}}</td>
        <td></td>
        <td>{{$negocio->persona_moral->rfc}}</td>
        <td></td>
        <td>{{optional($negocio->persona_moral)->regimen_fiscal}}</td>
        @else
        <td>{{$negocio->user->nombre}}</td>
        <td>{{$negocio->user->apellido_pat.' '.$negocio->user->apellido_mot}}</td>
        <td>{{$negocio->user->rfc}}</td>
        <td>{{$negocio->user->curp}}</td>
        <td>{{optional($negocio->user)->regimen_fiscal}}</td>
        @endif
        @if($entidad_revision!=5)
            @if($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$entidad_revision))->first()==null)
                    <td>Trámite no Generado (En Espera)</td>
                    <td>Trámite no Generado (En Espera)</td>
                    <td>Trámite no Generado (En Espera)</td>
                    <td>Trámite no Generado (En Espera)</td>
                @else
                @if($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$entidad_revision))->first()->catalogo_tramite->pago!=false)
                    @if(optional($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$entidad_revision))->first())->aviso_entero==null)
                    <td>AVISO SIN GENERAR</td>
                    <td>AVISO SIN GENERAR</td>
                    <td>AVISO SIN GENERAR</td>
                    <td>AVISO SIN GENERAR</td>
                        @else
                        <td>{{optional(optional($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$entidad_revision))->first())->aviso_entero)->fecha }} </td>
                        <td>{{optional(optional($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$entidad_revision))->first())->aviso_entero)->hora }}</td>
                        <td>{{optional(optional($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$entidad_revision))->first())->aviso_entero)->estado }}</td>
                        <td>{{optional(optional($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$entidad_revision))->first())->aviso_entero)->total }}</td>
                    @endif
                @else
                    <td>No Aplica</td>
                    <td>No Aplica</td>
                    <td>No Aplica</td>
                    <td>No Aplica</td>
                @endif
            @endif
        @endif
        </tr>
    @endforeach
</table>
