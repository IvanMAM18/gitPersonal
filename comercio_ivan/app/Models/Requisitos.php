<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Requisitos extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.requisitos'; // <-- El nombre personalizado

    protected $primaryKey = 'id';

    use SoftDeletes;
}
