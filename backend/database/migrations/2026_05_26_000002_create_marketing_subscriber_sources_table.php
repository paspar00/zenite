<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_subscriber_sources', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('marketing_subscriber_id');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedBigInteger('attendee_id')->nullable();
            $table->unsignedBigInteger('event_id')->nullable();
            $table->unsignedBigInteger('affiliate_id')->nullable();
            $table->unsignedBigInteger('campaign_link_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('marketing_subscriber_id')
                ->references('id')
                ->on('marketing_subscribers')
                ->onDelete('cascade');

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
            $table->foreign('attendee_id')->references('id')->on('attendees')->onDelete('set null');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('set null');
            $table->foreign('affiliate_id')->references('id')->on('affiliates')->onDelete('set null');

            $table->index('marketing_subscriber_id');
            $table->index('event_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_subscriber_sources');
    }
};
