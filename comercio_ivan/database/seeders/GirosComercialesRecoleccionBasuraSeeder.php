<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GirosComercialesRecoleccionBasuraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->truncate();

        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'a) Misceláneas',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'b) Fondas, Cocinas económicas, Cafés, Taquerías y Análogos.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'c) Restaurantes, restaurant-bar y Análogos.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'd) Hoteles, moteles, casas de Huéspedes y análogos.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'e) Salones de Fiestas, Bares, Centros Nocturnos y análogos.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'f) Guarderías, Jardines de Niños y Escuelas Particulares.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'g) Pescaderías',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'h) Almacenes Comerciales, Industriales, Bodegas y Bancos',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'i) Hospitales, sanatorios, laboratorios y similares, sin incluir deshechos tóxicos biológicos.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'j) Veterinarias, farmacias, consultorios médicos, boutique.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'k) Servicio de recolección de basura a vendedores ambulantes o semifijos que laboren en la vía pública.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'l) Servicio de recolección de basura a locatarios de mercados municipales en el Municipio de La Paz.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'm) Tiro la basura por mi propia cuenta en el relleno sanitario.',
        ]);
        DB::table('catalogo_giros_comerciales_recoleccion_basura')->insert([
            'nombre' => 'n) Contrato de recolección de basura privado.',
        ]);
    }
}
