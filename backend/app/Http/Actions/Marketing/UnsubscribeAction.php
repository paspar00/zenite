<?php

declare(strict_types=1);

namespace HiEvents\Http\Actions\Marketing;

use HiEvents\Http\Actions\BaseAction;
use HiEvents\Services\Application\Handlers\Unsubscribe\UnsubscribeHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UnsubscribeAction extends BaseAction
{
    public function __construct(
        private readonly UnsubscribeHandler $unsubscribeHandler,
    ) {
    }

    public function __invoke(Request $request, string $emailEncoded, string $token): JsonResponse
    {
        $padded = str_pad($emailEncoded, strlen($emailEncoded) + (4 - strlen($emailEncoded) % 4) % 4, '=');
        $email = base64_decode($padded, strict: true);

        if ($email === false) {
            throw ValidationException::withMessages([
                'email' => [__('Invalid unsubscribe link.')],
            ]);
        }

        $accountId = $request->query('account') ? (int) $request->query('account') : null;

        $expectedToken = hash_hmac(
            'sha256',
            $email . '|' . ($accountId ?? 'global'),
            config('app.key')
        );

        if (!hash_equals($expectedToken, $token)) {
            throw ValidationException::withMessages([
                'token' => [__('Invalid unsubscribe link.')],
            ]);
        }

        $this->unsubscribeHandler->handle(
            email: $email,
            accountId: $accountId,
            source: 'email_link',
        );

        return $this->jsonResponse([
            'message' => __('You have been unsubscribed successfully.'),
        ]);
    }
}
