<?php

namespace App\Observers;

use App\Models\cat_domicilio;

class bitacora_domicilio
{
    /**
     * Handle the cat_domicilio "created" event.
     *
     * @return void
     */
    public function created(cat_domicilio $cat_domicilio)
    {
        //
    }

    /**
     * Handle the cat_domicilio "updated" event.
     *
     * @return void
     */
    public function updated(cat_domicilio $cat_domicilio)
    {
    }

    /**
     * Handle the cat_domicilio "deleted" event.
     *
     * @return void
     */
    public function deleted(cat_domicilio $cat_domicilio)
    {
        //
    }

    /**
     * Handle the cat_domicilio "restored" event.
     *
     * @return void
     */
    public function restored(cat_domicilio $cat_domicilio)
    {
        //
    }

    /**
     * Handle the cat_domicilio "force deleted" event.
     *
     * @return void
     */
    public function forceDeleted(cat_domicilio $cat_domicilio)
    {
        //
    }
}
