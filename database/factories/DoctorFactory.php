<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Doctor;
use Faker\Generator as Faker;

$factory->define(Doctor::class, function (Faker $faker) {
    return [
        'qualification' => $faker->randomElement(['Doctor', 'Nurse', 'Heart Specialist']),
        'str_number' => $faker->randomNumber(2) . '.' . $faker->randomNumber(1) . '.'. $faker->randomNumber(1)  .'.'. $faker->randomNumber(3) .'.'. $faker->randomNumber(1) .'.'. $faker->randomNumber(2) .'.'. $faker->randomNumber(6) .'',
        'file_number' => $faker->randomNumber(5), 
        'application_date' => $faker->dateTime(),
        'valid_until' => $faker->dateTime(),
        'city' => $faker->city()
    ];
});
