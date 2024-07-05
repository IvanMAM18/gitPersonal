<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class CurpRule implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     */
    public function passes($attribute, $value): bool
    {
        if (! $this->correctLenght($value)) {
            return false;
        }
        if (! preg_match($this->pattern($value), $value, $matches)) {
            return false;
        }
        if (! $this->hasValidDate($matches)) {
            return false;
        }

        if (! $this->hasValidGender($matches)) {
            return false;
        }

        if (! $this->hasValidEntity($matches)) {
            return false;
        }

        if (! $this->hasValidHomonity($matches)) {
            return false;
        }
        if ($this->containsInconvenientWords($value)) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return __('El valor del campo CURP no es valido.');
    }

    /**
     * Verifica que el RFC tenga una longitud correcta.
     */
    private function correctLenght(string $curp): bool
    {
        $length = mb_strlen($curp);

        // El CURP debe ser de 18 letras
        // cualquier longitud fuera de ese rango resulta en un CURP inválido.
        return $length == 18;
    }

    /**
     * Devuelve el patrón que debe ser usado por preg_match() para el CURP en
     * cuestión.
     *
     * @see http://www.ordenjuridico.gob.mx/Federal/PE/APF/APC/SEGOB/Instructivos/InstructivoNormativo.pdf
     */
    private function pattern(string $curp): string
    {
        return '/^[A-Z]{4}([0-9]{2})([0-1][0-9])([0-3][0-9])([MH])([A-Z]{2})([A-Z]{3})([A-Z0-9]{1})([0-9]{1})$/iu';
    }

    /**
     * Verifica si el CURP tiene una fecha válida a partir de los 'match' del
     * resultado de preg_match().
     */
    private function hasValidDate(array $matches): bool
    {
        // Extraemos los datos de la fecha para poder validar su integridad.
        $year = (int) $matches[1];
        $month = (int) $matches[2];
        $day = (int) $matches[3];
        // Si el año es menor a 70 se asume que es después del año 2000.
        $year < 70 ? $year += 2000 : $year += 1900;

        return checkdate($month, $day, $year);
    }

    /**
     * Verifica si el CURP tiene un genero valido
     * resultado de preg_match().
     */
    private function hasValidGender(array $matches): bool
    {
        return $matches[4] == 'H' || $matches[4] == 'M' || $matches[4] == 'X';
    }

    /**
     * Verifica si el CURP tiene una entidad federativa valida
     * resultado de preg_match().
     */
    private function hasValidEntity(array $matches): bool
    {
        $entity = $matches[5];

        $valid_entities = [
            'AS',
            'BC',
            'BS',
            'CC',
            'CL',
            'CM',
            'CS',
            'CH',
            'DF',
            'DG',
            'GT',
            'GR',
            'HG',
            'JC',
            'MC',
            'MN',
            'MS',
            'NT',
            'NL',
            'OC',
            'PL',
            'QT',
            'QR',
            'SP',
            'SL',
            'SR',
            'TC',
            'TS',
            'TL',
            'VZ',
            'YN',
            'ZS',
            'NE',
        ];

        return in_array($entity, $valid_entities);
    }

    /**
     * Verifica si el CURP tiene una hominimia valida
     * resultado de preg_match().
     */
    private function hasValidHomonity(array $matches): bool
    {
        $homonity = $matches[7];
        $year = $matches[1];
        $is_XX = ! ((now()->year - 2000) >= $year);
        if ($is_XX) {
            if (is_numeric($homonity)) {
                return true;
            } else {
                return false;
            }
        } else {
            if (is_numeric($homonity)) {
                return false;
            } else {
                return true;
            }
        }
    }

    /**
     * Verifica si el RFC tiene palabras inconvenientes.
     *
     * @see http://www.ordenjuridico.gob.mx/Federal/PE/APF/APC/SEGOB/Instructivos/InstructivoNormativo.pdf
     */
    private function containsInconvenientWords(string $curp): bool
    {
        $inconvenientWords = [
            'BACA',
            'LOCO',
            'BAKA',
            'LOKA',
            'BUEI',
            'LOKO',
            'BUEY',
            'MAME',
            'CACA',
            'MAMO',
            'CACO',
            'MEAR',
            'CAGA',
            'MEAS',
            'CAGO',
            'MEON',
            'CAKA',
            'MIAR',
            'CAKO',
            'MION',
            'COGE',
            'MOCO',
            'COGI',
            'MOKO',
            'COJA',
            'MULA',
            'COJE',
            'MULO',
            'COJI',
            'NACA',
            'COJO',
            'NACO',
            'COLA',
            'PEDA',
            'CULO',
            'PEDO',
            'FALO',
            'PENE',
            'FETO',
            'PIPI',
            'GETA',
            'PITO',
            'GUEI',
            'POPO',
            'GUEY',
            'PUTA',
            'JETA',
            'PUTO',
            '777',
            'QULO',
            'KACA',
            'RATA',
            'KACO',
            'ROBA',
            'KAGA',
            'ROBE',
            'KAGO',
            'ROBO',
            'KAKA',
            'RUIN',
            'KAKO',
            'SENO',
            'KOGE',
            'TETA',
            'KOGI',
            'VACA',
            'KOJA',
            'VAGA',
            'KOJE',
            'VAGO',
            'KOJI',
            'VAKA',
            'KOJO',
            'VUEI',
            'KOLA',
            'VUEY',
            'KULO',
            'WUEI',
            'LILO',
            'WUEY',
            'LOCA',

        ];

        foreach ($inconvenientWords as $inconvenientWord) {
            if (strpos($curp, $inconvenientWord) !== false) {
                return true;
            }
        }

        return false;
    }
}
