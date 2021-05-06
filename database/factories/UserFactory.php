<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\User;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {
    return [
        'email' => $faker->unique()->safeEmail,
        'birthday' => $faker->dateTime(),
        'gender' => rand(0, 1),
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'first_name' => $faker->firstName(),
        'last_name'=> $faker->lastName(),
        'address'=> $faker->address(),
        'zip_code'=> $faker->postcode(),
        'city'=> $faker->city(),
        'province'=> $faker->state(),
        'country'=> $faker->country(),
        'last_ip' => $faker->ipv4()
    ];
});
