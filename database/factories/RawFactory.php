<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Raw;
use Faker\Generator as Faker;

$factory->define(Raw::class, function (Faker $faker) {
    return [
        'data' => rand(0, 100),
        'created_at' => $faker->dateTimeBetween('-1 month','now'),
    ];
});
