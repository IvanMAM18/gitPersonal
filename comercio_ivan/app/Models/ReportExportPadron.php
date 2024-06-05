<?php

namespace App\Models;

use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class ReportExportPadron implements FromView, ShouldAutoSize, WithColumnWidths, WithEvents
{
    private $year;

    public function __construct($year)
    {
        $this->year = $year;
    }

    public function view(): View
    {
        $estiloEncabezado = 'style="border: 1px solid rgb(105, 104, 104);   border-collapse: collapse;color:white; background-color:#888888;text-align:center;  overflow: hidden;"';
        $estiloEncabezado2 = 'style="border: 1px solid rgb(105, 104, 104);   border-collapse: collapse;color:black; background-color:#C4C4C4; text-align:center;  overflow: hidden;"';
        $negocios = Negocio::select(
            'negocios.id',
            'nombre_del_negocio',
            'venta_alcohol',
            'clave_catastral',
            'superficie_m2',
            'tamano_empresa',
            'horarios',
            'impacto_giro_comercial',
            'negocios.catalogo_tramite_id',
            'negocios.validado_por',
            'created_at',
            'updated_at',
            'direccion_id',
            'persona_id',
            'persona_moral_id'
        )
            ->whereHas('tramitesPadres', function (Builder $query) {
                $query->whereYear('tramites.created_at', $this->year);
            })
            ->with([
                'tramitesPadres' => function ($query) {
                    $query->whereYear('created_at', $this->year)
                        ->with('catalogo_tramite');
                },
                'resolutivos:resolutivos.id,resolutivos.folio,resolutivos.negocio_id,resolutivos.entidad_revisora_id',
                'direccion' => function ($direccion) {
                    $direccion->select('direcciones.id', 'direcciones.colonia_id', 'direcciones.codigo_postal', 'direcciones.calle_principal',
                        'direcciones.calles', 'direcciones.numero_externo', 'direcciones.numero_interno', 'direcciones.latitud', 'direcciones.longitude', 'direcciones.delegacion')
                        ->with([
                                'colonia:codigos_postales.id,codigos_postales.nombre_localidad',
                            ]);

                },
                'tramites' => function ($query) {
                    $query->whereYear('tramites.created_at', $this->year)
                        ->with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado,avisos_entero.created_at,avisos_entero.total',
                        ]);
                },
                'user',
                'persona_moral',
            ])
            ->orderBy('id', 'asc')
            ->get();

        return view('reportes.reporte_padron_comercio', [
            'negocios' => $negocios,
            'estiloEncabezado' => $estiloEncabezado,
            'estiloEncabezado2' => $estiloEncabezado2,
            'entidad_revision' => currentUser()->entidad_revision->id,
        ]);
    }

    public function columnWidths(): array
    {
        return [
            'B' => 35,
            'I' => 30,
            'D' => 40,
            'AE' => 30,
            'AM' => 30,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $workSheet = $event->sheet->getDelegate();
                $workSheet->freezePane('A2'); // freezing here
            },
        ];
    }
}
