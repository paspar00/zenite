<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_suppressions', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('account_id')->nullable();
            $table->string('email', 255);
            $table->enum('reason', [
                'unsubscribe',
                'bounce_hard',
                'bounce_soft',
                'spam_complaint',
                'manual',
                'lgpd_erasure',
            ]);
            $table->enum('source', [
                'order_flow',
                'email_link',
                'api',
                'organizer_import',
                'provider_webhook',
            ]);
            $table->timestamp('suppressed_at');
            $table->timestamp('expires_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');

            $table->index('email');
            $table->index(['account_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_suppressions');
    }
};
