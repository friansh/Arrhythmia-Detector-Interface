<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Raw extends Model
{
    public $timestamps = false;
    
    protected $hidden = [
        'id', 'classified_id',
    ];

    public function user() {
        return $this->belongsTo('App\Classified');
    }
}
