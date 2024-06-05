<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class personas_morales extends Model
{
    use SoftDeletes;

    protected $connection = 'pgsql';

    protected $table = 'public.personas_morales'; // <-- El nombre personalizado

    protected $primaryKey = 'id';
}
