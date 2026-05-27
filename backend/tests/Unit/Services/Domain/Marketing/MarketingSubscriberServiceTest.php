<?php

namespace Tests\Unit\Services\Domain\Marketing;

use HiEvents\DomainObjects\MarketingSubscriberDomainObject;
use HiEvents\DomainObjects\OrderDomainObject;
use HiEvents\Repository\Interfaces\MarketingSubscriberRepositoryInterface;
use HiEvents\Repository\Interfaces\MarketingSubscriberSourceRepositoryInterface;
use HiEvents\Services\Domain\Marketing\DTO\UpsertSubscriberData;
use HiEvents\Services\Domain\Marketing\MarketingSubscriberService;
use Illuminate\Support\Facades\DB;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class MarketingSubscriberServiceTest extends TestCase
{
    private MarketingSubscriberRepositoryInterface|MockInterface $subscriberRepository;
    private MarketingSubscriberSourceRepositoryInterface|MockInterface $sourceRepository;
    private MarketingSubscriberService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->subscriberRepository = Mockery::mock(MarketingSubscriberRepositoryInterface::class);
        $this->sourceRepository = Mockery::mock(MarketingSubscriberSourceRepositoryInterface::class);

        $this->service = new MarketingSubscriberService(
            $this->subscriberRepository,
            $this->sourceRepository,
        );
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function testSyncFromOrderDoesNothingWhenNotOptedIntoMarketing(): void
    {
        $order = Mockery::mock(OrderDomainObject::class);
        $order->shouldReceive('getOptedIntoMarketingAt')->andReturn(null);

        $this->subscriberRepository->shouldNotReceive('upsertFromOrder');
        $this->sourceRepository->shouldNotReceive('create');

        $this->service->syncFromOrder($order, 1);
    }

    public function testSyncFromOrderCreatesSubscriberWhenOptedIn(): void
    {
        $order = Mockery::mock(OrderDomainObject::class);
        $order->shouldReceive('getOptedIntoMarketingAt')->andReturn('2026-05-26 10:00:00');
        $order->shouldReceive('getEmail')->andReturn('test@example.com');
        $order->shouldReceive('getFirstName')->andReturn('John');
        $order->shouldReceive('getLastName')->andReturn('Doe');
        $order->shouldReceive('getLocale')->andReturn('en');
        $order->shouldReceive('getId')->andReturn(42);
        $order->shouldReceive('getEventId')->andReturn(10);
        $order->shouldReceive('getAffiliateId')->andReturn(null);

        $subscriber = Mockery::mock(MarketingSubscriberDomainObject::class);
        $subscriber->shouldReceive('getId')->andReturn(1);

        $this->subscriberRepository
            ->shouldReceive('upsertFromOrder')
            ->once()
            ->withArgs(function (UpsertSubscriberData $data) {
                return $data->email === 'test@example.com'
                    && $data->source === 'order_checkout'
                    && $data->account_id === 99
                    && $data->first_name === 'John';
            })
            ->andReturn($subscriber);

        $this->sourceRepository
            ->shouldReceive('create')
            ->once()
            ->withArgs(function (array $attrs) {
                return $attrs['marketing_subscriber_id'] === 1
                    && $attrs['order_id'] === 42
                    && $attrs['event_id'] === 10;
            })
            ->andReturn(Mockery::mock(MarketingSubscriberDomainObject::class));

        $this->service->syncFromOrder($order, 99);
    }

    public function testSyncFromOrderSilentlyIgnoresExceptions(): void
    {
        $order = Mockery::mock(OrderDomainObject::class);
        $order->shouldReceive('getOptedIntoMarketingAt')->andReturn('2026-05-26 10:00:00');
        $order->shouldReceive('getEmail')->andReturn('test@example.com');
        $order->shouldReceive('getFirstName')->andReturn(null);
        $order->shouldReceive('getLastName')->andReturn(null);
        $order->shouldReceive('getLocale')->andReturn('en');
        $order->shouldReceive('getId')->andReturn(5);
        $order->shouldReceive('getEventId')->andReturn(2);
        $order->shouldReceive('getAffiliateId')->andReturn(null);

        $this->subscriberRepository
            ->shouldReceive('upsertFromOrder')
            ->once()
            ->andThrow(new \RuntimeException('DB error'));

        $this->sourceRepository->shouldNotReceive('create');

        // Should not throw
        $this->service->syncFromOrder($order, 1);
    }
}
