<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('password', 200);
            $table->string('remember_token', 512)->unique()->nullable();
            $table->integer('remember_token_generated')->nullable()->unsigned();
            $table->string('email', 100)->unique();
            $table->string('first_name', 20);
            $table->string('last_name', 50);
            $table->string('address', 200);
            $table->dateTime('birthday');
            $table->boolean('gender');
            $table->string('zip_code', 10);
            $table->string('city', 190);
            $table->string('province', 90);
            $table->string('country', 90);
            $table->ipAddress('last_ip')->default('0.0.0.0');
            $table->boolean('admin')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
