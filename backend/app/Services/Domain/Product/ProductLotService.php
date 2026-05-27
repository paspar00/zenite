<?php

namespace HiEvents\Services\Domain\Product;

use HiEvents\DomainObjects\ProductDomainObject;
use HiEvents\DomainObjects\ProductPriceDomainObject;

class ProductLotService
{
    public function getActiveLot(ProductDomainObject $product): ?ProductPriceDomainObject
    {
        $prices = $product->getProductPrices();

        if (!$prices || $prices->isEmpty()) {
            return null;
        }

        return $prices
            ->sortBy(fn(ProductPriceDomainObject $p) => $p->getOrder() ?? 0)
            ->first(function (ProductPriceDomainObject $price) {
                if ($price->getIsHidden()) {
                    return false;
                }

                if ($price->isBeforeSaleStartDate()) {
                    return false;
                }

                if ($price->isAfterSaleEndDate()) {
                    return false;
                }

                if ($price->isSoldOut()) {
                    return false;
                }

                return true;
            });
    }

    public function filterToActiveLot(ProductDomainObject $product): void
    {
        if (!$product->getLotModeEnabled()) {
            return;
        }

        $activeLot = $this->getActiveLot($product);

        $product->setProductPrices(
            $activeLot !== null ? collect([$activeLot]) : collect()
        );
    }
}
