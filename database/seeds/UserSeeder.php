<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\User::class, 10)->create()->each(function ($user) {
            $user->device()->save( factory( App\Device::class )->make() );
            $user->doctor()->save( factory( App\Doctor::class )->make() );
            $user->raws()->saveMany( factory( App\Raw::class, 200 )->make() );
            $user->classifieds()->saveMany( factory( App\Classified::class, 20 )->make() );
        });
    }
}
