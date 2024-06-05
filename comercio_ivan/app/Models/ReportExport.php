<?php

namespace App\Models;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class ReportExport implements FromView, ShouldAutoSize, WithColumnWidths, WithEvents
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
            'impacto_giro_comercial',
            'negocios.catalogo_tramite_id',
            'negocios.validado_por',
            'created_at',
            'updated_at'
        )
            ->whereHas('tramitesPadres', function ($query) {
                $query->whereYear('tramites.created_at', $this->year);
            })
            ->with([
                'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
                'tramitesPadres' => function ($query) {
                    $query->whereYear('created_at', $this->year)
                        ->with('catalogo_tramite');
                },
                'tramites' => function ($query) {
                    $query->whereYear('tramites.created_at', $this->year)
                        ->with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado,avisos_entero.created_at',
                        ]);
                },
                'revisiones' => function ($query) {
                    $query->whereYear('revision.created_at', $this->year)
                        ->select('revision.id', 'revision.negocio_id', 'revision.entidad_revision_id', 'revision.tramite_id', 'revision.status', 'revision.created_at', 'revision.updated_at')
                        ->with('entidad:entidad_revision.id,entidad_revision.nombre')
                        ->with('estados_revision:estados_revision.id,estados_revision.revision_id,estados_revision.observaciones,estados_revision.created_at');
                },
            ])
            ->with('resolutivos', function ($resolutivo) {
                $resolutivo->whereHas('tramite', function ($q) {
                    $q->whereYear('created_at', $this->year);
                }
                )->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio', 'created_at'])->where('entidad_revisora_id', 5);
            })
            ->when(app()->environment('local'), function ($query) {
                $query->limit(1000);
            })
            ->orderBy('id', 'asc')->get();

        return view('reportes.reporte_tiempos', [
            'negocios' => $negocios,
            'estiloEncabezado' => $estiloEncabezado,
            'estiloEncabezado2' => $estiloEncabezado2,
            'year' => $this->year,
        ]);
    }

    public function columnWidths(): array
    {
        return [
            'B' => 35,
            'I' => 30,
            'O' => 30,
            'AE' => 30,
            'AM' => 30,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $workSheet = $event->sheet->getDelegate();
                $workSheet->freezePane('A3');
            },
        ];
    }
}
