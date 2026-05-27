<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_subscribers', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('account_id')->nullable()->index();
            $table->string('email', 255);
            $table->string('first_name', 255)->nullable();
            $table->string('last_name', 255)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('locale', 10)->nullable();
            $table->char('country_code', 2)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('status', [
                'active',
                'unsubscribed',
                'suppressed',
                'pending_confirmation',
            ])->default('active');
            $table->enum('source', [
                'order_checkout',
                'manual_import',
                'api',
                'campaign_link',
                'waitlist',
            ]);
            $table->timestamp('opted_in_at')->nullable();
            $table->timestamp('opted_out_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->json('tags')->nullable();
            $table->json('custom_fields')->nullable();
            $table->string('external_id', 255)->nullable();
            $table->timestamps();

            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');

            // Unique index on (account_id, email) — handle null account_id at application layer
            $table->unique(['account_id', 'email']);
            $table->index(['state', 'city']);
            $table->index(['account_id', 'status']);
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_subscribers');
    }
};
