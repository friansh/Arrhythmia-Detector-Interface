<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Classified;
use Faker\Generator as Faker;

$factory->define(Classified::class, function (Faker $faker) {
    return [
        'result' => rand(0, 8),
        'created_at' => $faker->dateTime()
    ];
});
