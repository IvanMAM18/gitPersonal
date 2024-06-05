<?php

namespace App\Helpers;

use Illuminate\Support\Collection;

class ClavesScian
{
    /**
     * Path donde estan guardadas las claves en formato json.
     */
    private $filePath = '/data/nuevos_ecologia_scian.json';

    /**
     * Coleccion de datos scian.
     */
    protected $collection;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->cargarArchivo($this->filePath);
    }

    public function cargarArchivo($filePath)
    {
        $contenido = file_get_contents(resource_path($filePath));
        $json = json_decode($contenido, true);
        $data = is_array($json) ? $json : [];
        $this->collection = collect($data);
        return $this;
    }
    /**
     * Regresa la coleccion de datos.
     */
    public function items()
    {
        return $this->collection;
    }
}
