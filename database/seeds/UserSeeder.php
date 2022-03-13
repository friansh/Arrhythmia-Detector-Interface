<?php

use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\User::class, 2)->create()->each(function ($user) {
            $user->device()->save( factory( App\Device::class )->make() );
            $user->doctor()->save( factory( App\Doctor::class )->make() );
            $user->classifieds()->saveMany( factory( App\Classified::class, 2 )->make() )->each(function ($classified) {
                $classified->raws()->saveMany( factory( App\Raw::class, 1000 )->make() );
            });
        });
    }

}
