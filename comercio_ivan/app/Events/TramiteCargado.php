<?php

namespace App\Events;

use App\Models\Tramite;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TramiteCargado
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public $tramite;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Tramite $tramite)
    {
        $this->tramite = $tramite;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
