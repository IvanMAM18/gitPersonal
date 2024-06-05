<?php

namespace Database\Factories;

use App\Models\LicenciaAlcohol;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LicenciaAlcoholFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    protected $model = LicenciaAlcohol::class;

    public function definition()
    {
        return [
            'tipo_abreviado' => $this->faker->name,
            'clave' => Str::slug($this->faker->name),
            'tipo' => $this->faker->text,
            'movimientos' => 1,
            'vigente' => true,
            'trabajador_id' => 1,
        ];
    }
}
