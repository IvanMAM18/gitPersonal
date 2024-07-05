<?php

namespace App\Http\Controllers\Api;

use App\Models\EntidadRevision;

class EntidadRevisorasController
{
    public function index()
    {
        return EntidadRevision::all();
    }
}
