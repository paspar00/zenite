<?php

namespace HiEvents\Http\Actions\Events;

use HiEvents\DomainObjects\EventSettingDomainObject;
use HiEvents\DomainObjects\ImageDomainObject;
use HiEvents\DomainObjects\Status\EventStatus;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Repository\Eloquent\Value\Relationship;
use HiEvents\Repository\Interfaces\EventRepositoryInterface;
use HiEvents\Resources\Event\EventResourcePublic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetAllEventsPublicAction extends BaseAction
{
    public function __construct(
        private readonly EventRepositoryInterface $eventRepository,
    )
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $events = $this->eventRepository
            ->loadRelation(new Relationship(EventSettingDomainObject::class))
            ->loadRelation(new Relationship(ImageDomainObject::class))
            ->findEvents(
                where: ['status' => EventStatus::LIVE->name],
                params: $this->getPaginationQueryParams($request),
            );

        return $this->resourceResponse(
            resource: EventResourcePublic::class,
            data: $events,
        );
    }
}
