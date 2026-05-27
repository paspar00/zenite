<?php

declare(strict_types=1);

namespace HiEvents\Http\Actions\Marketing;

use HiEvents\DomainObjects\Generated\MarketingSubscriberDomainObjectAbstract;
use HiEvents\DomainObjects\MarketingSubscriberDomainObject;
use HiEvents\DomainObjects\OrganizerDomainObject;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Interfaces\MarketingSubscriberRepositoryInterface;
use HiEvents\Repository\Interfaces\OrganizerRepositoryInterface;
use HiEvents\Resources\Marketing\MarketingSubscriberResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetMarketingSubscribersAction extends BaseAction
{
    public function __construct(
        private readonly MarketingSubscriberRepositoryInterface $subscriberRepository,
        private readonly OrganizerRepositoryInterface $organizerRepository,
    ) {
    }

    public function __invoke(Request $request, int $organizerId): JsonResponse
    {
        $this->isActionAuthorized($organizerId, OrganizerDomainObject::class);

        $organizer = $this->organizerRepository->findFirstWhere([
            'id' => $organizerId,
            'account_id' => $this->getAuthenticatedAccountId(),
        ]);

        if ($organizer === null) {
            return $this->notFoundResponse();
        }

        $accountId = $this->getAuthenticatedAccountId();
        $perPage = min((int) $request->query('per_page', 25), 100);
        $page = (int) $request->query('page', 1);

        $where = [
            [MarketingSubscriberDomainObjectAbstract::ACCOUNT_ID, '=', $accountId],
        ];

        if ($status = $request->query('status')) {
            $where[] = [MarketingSubscriberDomainObjectAbstract::STATUS, '=', $status];
        }

        if ($state = $request->query('state')) {
            $where[] = [MarketingSubscriberDomainObjectAbstract::STATE, '=', $state];
        }

        if ($city = $request->query('city')) {
            $where[] = [MarketingSubscriberDomainObjectAbstract::CITY, '=', $city];
        }

        if ($search = $request->query('search')) {
            $where[] = static function (Builder $builder) use ($search) {
                $builder
                    ->orWhere(MarketingSubscriberDomainObjectAbstract::EMAIL, 'ilike', '%' . $search . '%')
                    ->orWhere(MarketingSubscriberDomainObjectAbstract::FIRST_NAME, 'ilike', '%' . $search . '%')
                    ->orWhere(MarketingSubscriberDomainObjectAbstract::LAST_NAME, 'ilike', '%' . $search . '%');
            };
        }

        $subscribers = $this->subscriberRepository->paginateWhere(
            where: $where,
            limit: $perPage,
            page: $page,
        );

        return $this->filterableResourceResponse(
            resource: MarketingSubscriberResource::class,
            data: $subscribers,
            domainObject: MarketingSubscriberDomainObject::class,
        );
    }
}
