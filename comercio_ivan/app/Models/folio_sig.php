<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class folio_sig extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.folio_sig'; // <-- El nombre personalizado

    protected $primaryKey = 'folio';
}
