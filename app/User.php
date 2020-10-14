<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    public function raws() {
        return $this->hasMany('App\Raw');
    }

    public function classifieds() {
        return $this->hasMany('App\Classified')->orderBy('created_at', 'desc');
    }

    // public function lastClassifieds() {
    //     return $this->hasMany('App\Classified')->orderBy('created_at', 'desc');
    // }

    public function device() {
        return $this->hasOne('App\Device');
    }

    public function messages() {
        return $this->hasMany('App\Message');
    }

    public function doctor() {
        return $this->hasOne('App\Doctor');
    }
}
