<?php

declare(strict_types=1);

namespace HiEvents\Services\Application\Handlers\Unsubscribe;

use HiEvents\Repository\Interfaces\MarketingConsentAuditRepositoryInterface;
use HiEvents\Repository\Interfaces\MarketingSuppressionRepositoryInterface;
use Illuminate\Http\Request;

class UnsubscribeHandler
{
    public function __construct(
        private readonly MarketingSuppressionRepositoryInterface $suppressionRepository,
        private readonly MarketingConsentAuditRepositoryInterface $consentAuditRepository,
        private readonly Request $request,
    ) {
    }

    public function handle(string $email, ?int $accountId, string $source = 'email_link'): void
    {
        $email = strtolower(trim($email));

        $existing = $this->suppressionRepository->findFirstWhere(array_filter([
            'email' => $email,
            'account_id' => $accountId,
        ], fn($v) => $v !== null));

        if ($existing === null) {
            $this->suppressionRepository->create([
                'email' => $email,
                'account_id' => $accountId,
                'reason' => 'unsubscribe',
                'source' => $source,
                'suppressed_at' => now()->toDateTimeString(),
            ]);
        }

        $this->consentAuditRepository->create([
            'email' => $email,
            'account_id' => $accountId,
            'action' => 'opt_out',
            'ip_address' => $this->request->ip() ?? '0.0.0.0',
            'user_agent' => $this->request->userAgent(),
            'created_at' => now()->toDateTimeString(),
        ]);
    }
}
