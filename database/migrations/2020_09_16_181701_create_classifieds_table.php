<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassifiedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classifieds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->double('rr');
            $table->double('rr_stdev');
            $table->double('pr');
            $table->double('pr_stdev');
            $table->double('qs');
            $table->double('qs_stdev');
            $table->double('qt');
            $table->double('qt_stdev');
            $table->double('st');
            $table->double('st_stdev');
            $table->double('heartrate');
            $table->string('classification_result');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('classifieds');
    }
}
