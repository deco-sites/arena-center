import { ProductDetailsPage } from "apps/commerce/types.ts";
import SectionUi from "../ui/Section.tsx";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useId } from "../../sdk/useId.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { relative } from "../../sdk/url.ts";
import { formatPrice } from "../../sdk/format.ts";
import AddToCartBuyTogether from "./AddToCartBuyTogether.tsx";
import type { Product } from "apps/commerce/types.ts";
import ProductCardBuyTogether from "./ProductCartBuyTogether.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import ShippingSimulationForm from "../shipping/Form.tsx";

/** title {{{title}}} */
export interface IconItem {
  icon: ImageWidget;
  title: string;
}

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  products: Product[] | null;
  icons?: IconItem[];
}

export default function BuyTogetherComponent({ page, products, icons}: Props) {
  if (page === null || products === null) {
    throw new Error("Informações do produto insdisponível");
  }

  const { product } = page;
  const { productID, offers } = product;

  const { availability, seller = "1" } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";

  const pdpProductTag = product.additionalProperty?.find(({ name }) =>
    name?.includes("categoria")
  )?.value;



  // Find the related product
  const secondProduct = pdpProductTag
    ? products.find((item) => {
        return (
          item.additionalProperty?.find(({ name }) =>
            name?.includes(pdpProductTag)
          ) !== undefined && item.productID !== productID
        );
      })
    : undefined;
  console.log("pdp", pdpProductTag, secondProduct);
  const totalPrice =
    offers &&
    secondProduct &&
    offers.lowPrice + (secondProduct.offers?.lowPrice || 0);

  return (
    <div class="container flex flex-col gap-2 sm:gap-5 md:w-full pt-8 items-center py-5 w-[350px] mt-2 mx-auto">
      {page !== undefined && secondProduct !== undefined && (
        <div class="flex flex-col ">
          <div class="flex md:flex-row flex-col md:items-center mx-auto md:gap-2">
            <div class="flex items-center">
              <ProductCardBuyTogether
                index={1}
                product={product}
                class="md:w-[200px] w-[150px]"
              />
              <div class="py-auto w-[25px] h-[25px] z-10">
                <p class="w-full h-full text-xl font-bold text-base-100 bg-secondary rounded-full flex items-center justify-center">
                  +
                </p>
              </div>
              {secondProduct && (
                <ProductCardBuyTogether
                  index={1}
                  product={secondProduct}
                  class="md:w-[200px] w-[150px]"
                />
              )}
            </div>
            <div class="flex flex-col mt-3 md:mt-0">
              <div class="py-auto w-[25px] h-[25px] mx-auto">
                <p class="w-full h-full text-xl font-bold text-base-100 bg-secondary rounded-full flex items-center justify-center">
                  =
                </p>
              </div>

              <div class="flex flex-col items-center md:justify-center">
                <p class="text-sm font-semibold ">Valor total:</p>
                <p class="text-2lg font-bold text-secondary">
                  {" "}
                  {formatPrice(totalPrice, offers?.priceCurrency)}
                </p>
              </div>
            </div>
          </div>
          <div>
            {inStock && secondProduct ? (
              <AddToCartBuyTogether
                products={[product, secondProduct]}
                class={clx("")}
                icon=""
              />
            ) : (
              <p
                class={clx(
                  "btn",
                  "btn-outline justify-center  !text-[12px] !font-medium px-0 no-animation w-full",
                  "text-center border border-secondary btn-secondary min-h-0 h-[26px]"
                )}
              >
                Fora de estoque
              </p>
            )}
          </div>
        </div>
      )}

      {/* Shipping Simulation */}
      <div class="">
        <ShippingSimulationForm
          items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
        />
      </div>

      {/* Garanty Icons */}
      <div class="flex w-full px-11 justify-between pt-6 border-t border-gray-300">
        {icons &&
          icons.map((item) => (
            <div class="flex items-center flex-col gap-3 ">
              <Image src={item.icon} width={31} height={31} alt={item.title} />
              <p class="text-accent-content text-[12px]">{item.title}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export const LoadingFallback = () => <SectionUi.Placeholder height="635px" />;
