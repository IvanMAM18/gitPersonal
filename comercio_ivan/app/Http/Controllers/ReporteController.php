<?php

namespace App\Http\Controllers;

use App\Models\ReportExport;
use App\Models\ReportExportPadron;
use Illuminate\Support\Facades\URL;
use Maatwebsite\Excel\Facades\Excel;

class ReporteController extends Controller
{
    public function get_url_reporte_firmado($year)
    {
        return URL::SignedRoute('get-reporte-tiempos', $year);
    }

    public function get_url_reporte_padron_firmado($year)
    {
        return URL::SignedRoute('get-reporte-padron', $year);
    }

    public function getReporteTiempos($year)
    {
        return Excel::download(new ReportExport($year), 'reporteTiempos año '.$year.'-'.now()->format('d-m-Y H:i').'.xlsx');
    }

    public function getReportePadron($year)
    {
        return Excel::download(new ReportExportPadron($year), 'reportePadron '.\Auth::user()->entidad_revision->nombre.' año '.$year.'-'.now()->format('d-m-Y H:i').'.xlsx');
    }
}
