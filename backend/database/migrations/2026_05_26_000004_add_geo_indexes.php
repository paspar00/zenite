<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('marketing_subscribers', function (Blueprint $table) {
            $table->index(['latitude', 'longitude'], 'ms_lat_lng_idx');
            $table->index('last_geo_email_sent_at', 'ms_last_geo_email_idx');
        });
    }

    public function down(): void
    {
        Schema::table('marketing_subscribers', function (Blueprint $table) {
            $table->dropIndex('ms_lat_lng_idx');
            $table->dropIndex('ms_last_geo_email_idx');
        });
    }
};
