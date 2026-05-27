<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_consent_audit', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('account_id')->nullable();
            $table->string('email', 255);
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedBigInteger('attendee_id')->nullable();
            $table->enum('action', ['opt_in', 'opt_out', 'erasure_request']);
            $table->string('ip_address', 45);
            $table->text('user_agent')->nullable();
            $table->text('consent_text_snapshot')->nullable();
            $table->unsignedBigInteger('event_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('set null');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
            $table->foreign('attendee_id')->references('id')->on('attendees')->onDelete('set null');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_consent_audit');
    }
};
