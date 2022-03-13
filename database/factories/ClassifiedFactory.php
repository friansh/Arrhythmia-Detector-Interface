<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Classified;
use Faker\Generator as Faker;

$factory->define(Classified::class, function (Faker $faker) {
    return [
        'rr' => $faker->randomFloat(5),
        'rr_stdev' => $faker->randomFloat(5),
        'pr' => $faker->randomFloat(5),
        'pr_stdev' => $faker->randomFloat(5),
        'qs' => $faker->randomFloat(5),
        'qs_stdev' => $faker->randomFloat(5),
        'qt' => $faker->randomFloat(5),
        'qt_stdev' => $faker->randomFloat(5),
        'st' => $faker->randomFloat(5),
        'st_stdev' => $faker->randomFloat(5),
        'heartrate' => $faker->randomFloat(5),
        'classification_result' => ucwords(str_replace('.', '', $faker->sentence(2))),
        'created_at' => $faker->dateTimeBetween('-1 month','now'),
    ];
});
