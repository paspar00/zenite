<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('marketing_subscribers', function (Blueprint $table) {
            $table->timestamp('last_geo_email_sent_at')->nullable()->after('last_activity_at');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->timestamp('geo_campaign_sent_at')->nullable()->after('updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('marketing_subscribers', function (Blueprint $table) {
            $table->dropColumn('last_geo_email_sent_at');
        });
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('geo_campaign_sent_at');
        });
    }
};
