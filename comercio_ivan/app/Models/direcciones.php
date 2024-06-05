<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class direcciones extends Model
{
    use SoftDeletes;

    protected $connection = 'pgsql';

    protected $table = 'public.direcciones'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
