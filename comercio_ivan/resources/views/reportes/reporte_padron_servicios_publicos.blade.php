<table style=" table-layout: fixed;">
    <tr>
        <th {!!$estiloEncabezado!!}>Trámite ID</th>
        <th {!!$estiloEncabezado!!}>Nombre del Comercio</th>
        <th {!!$estiloEncabezado!!}>Giros</th>
        <th {!!$estiloEncabezado!!}>Impacto Giro</th>
        <th {!!$estiloEncabezado!!}>Dirección</th>
        <th {!!$estiloEncabezado!!}>CP</th>
        <th {!!$estiloEncabezado!!}>Colonia</th>
        <th {!!$estiloEncabezado!!}>Delegación</th>
        <th {!!$estiloEncabezado!!}>Latitud</th>
        <th {!!$estiloEncabezado!!}>Longitud</th>
        <th {!!$estiloEncabezado!!}>Tamaño Empresa</th>
        <th {!!$estiloEncabezado!!}>Tipo de Recolección</th>
        <th {!!$estiloEncabezado!!}>Volumen</th>
        <th {!!$estiloEncabezado!!}>Empresa Privada</th>

    </tr>
    @foreach($negocios as $negocio)
        <tr>
        <td>{{$negocio->tramitesPadres->first()->id}}</td>
        <td>{{$negocio->nombre_del_negocio}}</td>
        <td>
            @foreach ($negocio->giro_comercial as $giro)
            {{$giro->nombre}}|
            @endforeach
        </td>
        <td>{{$negocio->impacto_giro_comercial=='bajo_impacto'?'BAJO IMPACTO' : 'ALTO IMPACTO'}}</td>
        <td>{{$negocio->direccion_completa}}</td>
        <td>{{$negocio->direccion->codigo_postal}}</td>
        <td>{{$negocio->direccion->colonia->nombre_localidad}} </td>
        <td>{{$negocio->direccion->delegacion}} </td>
        <td>{{$negocio->direccion->latitud }}</td>
        <td>{{$negocio->direccion->longitude}}</td>
        <td>{{$negocio->tamano_empresa}}</td> 
        <td>{{$negocio->servicio_basura}}</td> 
        <td>{{$negocio->volumen}}</td> 
        <td>{{$negocio->servicio_priv_recoleccion}}</td> 
        </tr>
    @endforeach
</table>
