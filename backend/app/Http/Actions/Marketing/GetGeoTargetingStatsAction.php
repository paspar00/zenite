<?php

declare(strict_types=1);

namespace HiEvents\Http\Actions\Marketing;

use HiEvents\DomainObjects\OrganizerDomainObject;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\OrganizerRepositoryInterface;
use HiEvents\Services\Domain\Marketing\GeoTargetingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetGeoTargetingStatsAction extends BaseAction
{
    public function __construct(
        private readonly GeoTargetingService $geoTargetingService,
        private readonly OrganizerRepositoryInterface $organizerRepository,
    ) {
    }

    public function __invoke(Request $request, int $organizerId, int $eventId): JsonResponse
    {
        $this->isActionAuthorized($organizerId, OrganizerDomainObject::class);

        $organizer = $this->organizerRepository->findFirstWhere([
            'id' => $organizerId,
            'account_id' => $this->getAuthenticatedAccountId(),
        ]);

        if ($organizer === null) {
            return $this->notFoundResponse();
        }

        $stats = $this->geoTargetingService->getGeoStatsForEvent(
            eventId: $eventId,
            accountId: $this->getAuthenticatedAccountId(),
        );

        return $this->jsonResponse([
            'data' => $stats,
        ]);
    }
}
