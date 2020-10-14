<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Device;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(Device::class, function (Faker $faker) {
    return [
        'token' => Str::random(256),
        'battery' => rand(0, 100)
    ];
});
