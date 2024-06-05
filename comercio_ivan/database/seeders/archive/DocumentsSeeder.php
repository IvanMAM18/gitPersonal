<?php

namespace Database\Seeders\Archive;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // requisitos
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['identificacion-frontal', 'Identificacion oficial (frontal)', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['identificacion-trasera', 'Identificacion oficial (trasera)', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['comprobante-de-domicilio', 'Comprobante de domicilio', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['acta-nacimiento', 'Acta de Nacimiento', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['acta-rfc', 'Acta de RFC', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['permiso-uso-suelo', 'Permiso de Uso de Suelo', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['reanudacion-procedimientos', 'Aviso de Reanudacion de Procedimientos', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['comprobante-pago', 'Comprobante de pago', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['licencia-cofepris', 'Licenciamiento de COFEPRIS', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['comprobante-domicilio', 'Comprobante de Domicilio', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['fiscalizacion', 'Comprobante de Fiscalizacion', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['licencia-catastro', 'Comprobante de Licencia Catastro', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['factura-alineada', 'Clave de Factura Alineada', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['declaracion-aduanas', 'Comprobante de Declaracion de aduanas', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['mapa-de-area', 'Mapa de Area del Inmueble', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['mapa-estructural', 'Mapa Estructural del Inmueble', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['comprobante-domicilio-fiscal', 'Comprobante de Domicilio Fiscal', null]);
        DB::insert('INSERT INTO requisitos (nombre, descripcion, caduca) VALUES (?, ?, ?)', ['cedula-identificacion-fiscal', 'Cedula de Identificacion Fiscal', null]);

        // Identificacion Frontal
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 1]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 1]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 1]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 1]);

        // Identificacion Trasera
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 2]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 2]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 2]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 2]);

        // comprobante-de-domicilio
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 3]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 3]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 3]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 3]);

        // Acta de nacimiento
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 4]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 4]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 4]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 4]);

        // Acta RFC
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 5]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 5]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 5]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 5]);

        // Uso de Suelo
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 6]);

        //reanudacion-procedimientos
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 7]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 7]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 7]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 7]);

        // reanudacion-procedimientos
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 8]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 8]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 8]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 8]);

        // COFEPRIS
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 9]);

        // comprobante de domicilio
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 10]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 10]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 10]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 10]);

        // comprobante de fiscalizacion
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 11]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 11]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 11]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 11]);

        // Catastro
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 12]);

        // factura alineada
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 13]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 13]);

        // declaracion de aduanas
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 14]);

        // mapa de area
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 15]);

        // mapa estructural
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 16]);

        // comprobante de domicilio fiscal
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 17]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 17]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 17]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 17]);

        // comprobante de identificacion fiscal
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [1, 18]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [2, 18]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [3, 18]);
        DB::insert('INSERT INTO catalogo_requisitos (entidad_id, requisito_id) VALUES (?, ?)', [4, 18]);
    }
}
