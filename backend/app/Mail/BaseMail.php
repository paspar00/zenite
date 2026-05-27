<?php

namespace HiEvents\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

abstract class BaseMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct()
    {
        $this->afterCommit();
    }

    abstract public function envelope(): Envelope;

    abstract public function content(): Content;

    protected function buildUnsubscribeHeaders(string $email, ?int $accountId): Headers
    {
        $token = hash_hmac('sha256', $email . '|' . ($accountId ?? 'global'), config('app.key'));
        $encoded = rtrim(base64_encode($email), '=');
        $query = $accountId ? '?account=' . $accountId : '';
        $apiUrl = url('/api/public/unsubscribe/' . $encoded . '/' . $token . $query);

        return new Headers(
            text: [
                'List-Unsubscribe' => '<' . $apiUrl . '>',
                'List-Unsubscribe-Post' => 'List-Unsubscribe=One-Click',
            ],
        );
    }

    protected function buildUnsubscribeUrl(string $email, ?int $accountId): string
    {
        $token = hash_hmac('sha256', $email . '|' . ($accountId ?? 'global'), config('app.key'));
        $encoded = rtrim(base64_encode($email), '=');
        $query = $accountId ? '?account=' . $accountId : '';
        $frontendUrl = rtrim(config('app.frontend_url', config('app.url')), '/');
        return $frontendUrl . '/unsubscribe/' . $encoded . '/' . $token . $query;
    }
}
