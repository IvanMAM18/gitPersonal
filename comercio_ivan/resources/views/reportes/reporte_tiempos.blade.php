<table style=" table-layout: fixed;">
    <tr>
        <th rowspan="2" {!!$estiloEncabezado!!}>Trámite ID</th>
        <th rowspan="2" {!!$estiloEncabezado!!}>Negocio</th>
        <th rowspan="2" {!!$estiloEncabezado!!}>Fecha de Recepción del Trámite</th>
        <th rowspan="2" {!!$estiloEncabezado!!}>Impacto Giro</th>
        <th rowspan="2" {!!$estiloEncabezado!!}>Tipo de Trámite</th>
        <th rowspan="2" {!!$estiloEncabezado!!}>Venta Alcohol</th>
        <th rowspan="2" {!!$estiloEncabezado!!}>Emisión de Licencia</th>
        <th {!!$estiloEncabezado!!} colspan="8">Comercio</th>
        <th {!!$estiloEncabezado!!} colspan="11">Uso de Suelo</th>
        <th {!!$estiloEncabezado!!} colspan="11">Protección Civil</th>
        <th {!!$estiloEncabezado!!} colspan="11">Ecología</th>
        <th {!!$estiloEncabezado!!} colspan="11">Servicios Públicos</th>
        <th {!!$estiloEncabezado!!} colspan="11">Alcoholes</th>
        <th {!!$estiloEncabezado!!} colspan="2">Resolutivo</th>
        <th  rowspan="2"  {!!$estiloEncabezado!!}>Es Refrendo de Año Anterior</th>
    </tr>
    <tr>
        @for($i=0;$i<6;$i++)
            <td  {!!$estiloEncabezado2!!}>Fecha Recepción ER</td>
            <td  {!!$estiloEncabezado2!!}>Hora Recepción ER</td>
            <td  {!!$estiloEncabezado2!!}>Fecha Acción*</td>
            <td  {!!$estiloEncabezado2!!}>Hora Acción*</td>
            <td  {!!$estiloEncabezado2!!}>Acción*</td>
            <td  {!!$estiloEncabezado2!!}>Primera Observación</td>
            <td  {!!$estiloEncabezado2!!}>Fecha Primera Observacion</td>
            <td  {!!$estiloEncabezado2!!}>Hora Primera Observación</td>
            @if($i!=0)
                <td  {!!$estiloEncabezado2!!}>Fecha Aviso de Entero</td>
                <td  {!!$estiloEncabezado2!!}>Hora  Aviso de Entero</td>
                <td  {!!$estiloEncabezado2!!}>Estado Aviso</td>
            @endif
        @endfor
        <td  {!!$estiloEncabezado2!!}>Fecha de Emisión de Resolutivo</td>
        <td  {!!$estiloEncabezado2!!}>Hora de Emisión de Resolutivo</td>
    </tr>
    @foreach($negocios as $negocio)
        <tr>
        <td>{{$negocio->tramitesPadres->first()->id}}</td>
        <td>{{$negocio->nombre_del_negocio}}</td>
        <td>{{$negocio->tramitesPadres->first()->fecha}}</td>
        <td>{{$negocio->impacto_giro_comercial=='bajo_impacto'?'BAJO IMPACTO' : 'ALTO IMPACTO'}}</td>
        <td>{{$negocio->tramitesPadres->first()->catalogo_tramite->nombre}}</td>
        <td>{{$negocio->venta_alcohol==true?'SI':'NO'}}</td>
        <td>{{$negocio->resolutivos->where('entidad_revisora_id', 5)->first()==null?'Sin Emitir':'Activa'}}</td>
        <td>{{$negocio->tramitesPadres->first()->fecha }}</td>
        <td>{{$negocio->tramitesPadres->first()->hora }}</td>
        @if($negocio->created_at->year==($year-1))
        <td>{{$negocio->fecha }}</td>
        <td>{{$negocio->hora }}</td>
        @else
        <td>{{$negocio->tramitesPadres->first()->fecha }}</td>
        <td>{{$negocio->tramitesPadres->first()->hora }}</td>
        @endif
        <td>{{($negocio->validado_por!=0 ?'APROBADO':'SIN APROBAR')}}</td>
        @if($negocio->revisiones->where('entidad_revision_id',5)->first()!=null)
            <td>{{(optional($negocio->revisiones->where('entidad_revision_id',5)->first()->estados_revision->first()))->observaciones}}</td>
            <td>{{(optional($negocio->revisiones->where('entidad_revision_id',5)->first()->estados_revision->first()))->fecha }}</td>
            <td>{{(optional($negocio->revisiones->where('entidad_revision_id',5)->first()->estados_revision->first()))->hora}}</td>
        @else
            <td></td>
            <td></td>
            <td></td>
        @endif
        @for($i=1;$i<=6;$i++)
            @if($i==5) @continue @endif
            @if($negocio->revisiones->where('entidad_revision_id',$i)->first()==null) @for($i2=1;$i2<=11;$i2++)<td></td>@endfor  @continue @endif
            <td>{{($negocio->revisiones->where('entidad_revision_id',$i)->first()->fecha_creacion)}}</td>
            <td>{{($negocio->revisiones->where('entidad_revision_id',$i)->first()->hora_creacion)}}</td>
            <td>{{($negocio->revisiones->where('entidad_revision_id',$i)->first()->fecha)}}</td>
            <td>{{($negocio->revisiones->where('entidad_revision_id',$i)->first()->hora)}}</td>
            <td>{{($negocio->revisiones->where('entidad_revision_id',$i)->first()->status)}}</td>
            @if($negocio->revisiones->where('entidad_revision_id',$i)->first()->estados_revision->first()!=null)
            <td>{{(optional($negocio->revisiones->where('entidad_revision_id',$i)->first()->estados_revision->skip(1)->first())->observaciones)}}</td>
            <td>{{(optional($negocio->revisiones->where('entidad_revision_id',$i)->first()->estados_revision->skip(1)->first())->fecha )}}</td>
            <td>{{(optional($negocio->revisiones->where('entidad_revision_id',$i)->first()->estados_revision->skip(1)->first())->hora)}}</td>
            @else
                <td></td><td></td><td></td>
            @endif
            @if($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$i))->first()?->catalogo_tramite->pago!=false)
                <td>{{optional(optional($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$i))->first())->aviso_entero)->fecha }} </td>
                <td>{{optional(optional($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$i))->first())->aviso_entero)->hora }}</td>
                <td>{{optional(optional($negocio->tramites->whereIn('catalogo_tramites_id', get_entidad_del_catalogo('entidad',$i))->first())->aviso_entero)->estado }}</td>
            @else
                <td>No Aplica</td>
                <td>No Aplica</td>
                <td>No Aplica</td>
            @endif

        @endfor
        <td>{{$negocio->resolutivos->first()==null?'Sin Emitir':$negocio->resolutivos->first()->fecha}}</td>
        <td>{{$negocio->resolutivos->first()==null?'Sin Emitir':$negocio->resolutivos->first()->hora}}</td>
        @if($negocio->created_at->year==($year-1))
        <td>SI</td>
            @else
        <td>NO</td>
        @endif
    </tr>
    @endforeach
    <tr >
        <td colspan="8"> *Para el Caso de la acción de Comercio se pone una fecha aproximada, ya que actualmente no se almacena el dato preciso </td>
    </tr>
</table>
