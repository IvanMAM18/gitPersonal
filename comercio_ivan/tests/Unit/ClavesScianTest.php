<?php

namespace Tests\Unit;

use App\Helpers\ClavesScian;
use Tests\TestCase;

class ClavesScianTest extends TestCase
{
    public function test_claves_scian(): void
    {
        $clavesScian = resolve(ClavesScian::class);
        $this->assertArrayNotHasKey('TITULO', $clavesScian->items()->pluck('CLAVE_SCIAN'));
        $this->assertIsNumeric($clavesScian->items()->pluck('CLAVE_SCIAN')->first());
        $claveScianItem = $clavesScian->items()->first();
        $this->assertArrayHasKey('CLAVE_SCIAN', $claveScianItem);
        $this->assertArrayHasKey('TITULO', $claveScianItem);
        $this->assertArrayHasKey('DESCRIPCION', $claveScianItem);
    }
}
