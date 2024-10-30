import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import { Ring } from "./ProductVariantSelector.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCardBuyTogether({
  product,
  preload,

  index,
  class: _class,
}: Props) {
  const id = useId();

  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);
  const percent = listPrice && offers?.lowPrice
    ? Math.round(((listPrice - offers?.lowPrice) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {/* Add click event to dataLayer */}
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        items: [item],
      },
    },
  });

  //Added it to check the variant name in the SKU Selector later, so it doesn't render the SKU to "shoes size" in the Product Card
  const firstVariantName = firstSkuVariations?.[0]?.toLowerCase();
  const shoeSizeVariant = "shoe size";

  return (
    <div
      {...event}
      class={clx(
        "card card-compact group text-[10px] hover:shadow-lg p-2  ",
        _class,
      )}
    >
      <figure
        class={clx(
          "relative bg-base-100",
          "rounded border border-primary  w-[143px]",
          "mx-auto",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "absolute top-0 left-0 m-auto ",
            "grid grid-cols-1 grid-rows-1",
            "w-full bg-base-100",
            !inStock && "opacity-70",
          )}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={143}
            height={143}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-contain",
              "rounded",
              "col-span-full row-span-full",
            )}
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={143}
            height={143}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-contain",
              "rounded",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100 border border-primary",
            )}
            loading="lazy"
            decoding="async"
          />
        </a>

        <div
          class={clx(
            "text-[10px] font-semibold text-base-100 bg-primary text-center rounded-badge w-[48px] h-[20px] uppercase",
            "absolute top-1 left-1 flex flex-col items-center justify-center",
            (percent < 1 || !inStock) && "opacity-1",
          )}
        >
          <span>10% off</span>
        </div>
      </figure>

      <a href={relativeUrl} class="pt-5 flex flex-col items-center">
        <span class="font-medium text-sm text-secondary text-center h-16">
          {title}
        </span>

        <div class="flex gap-2 pt-2">
          {listPrice && (
            <span class="line-through font-normal text-gray-400">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-bold text-[12px] text-secondary">
            {formatPrice(offers?.lowPrice, offers?.priceCurrency)}
          </span>
        </div>
      </a>

      {/* SKU Selector */}
      {
        /* {variants.length > 1 && firstVariantName !== shoeSizeVariant && (
        <ul class="flex items-center justify-start gap-2 pt-4 pb-1 pl-1 overflow-x-auto border border-primary">
          {variants
            .map(([value, link]) => [value, relative(link)] as const)
            .map(([value, link]) => (
              <li>
                <a href={link} class="cursor-pointer">
                  <input
                    class="hidden peer"
                    type="radio"
                    name={`${id}-${firstSkuVariations?.[0]}`}
                    checked={link === relativeUrl}
                  />
                  <Ring value={value} checked={link === relativeUrl} />
                </a>
              </li>
            ))}
        </ul>
      )} */
      }

      {/* <div class="flex-grow pt-5" /> */}

      {
        /* <div>
        {inStock ? (
          <AddToCartButton
            product={product}
            seller={seller}
            item={item}
            class={clx("btn btn-primary no-animation w-full")}
            icon={""}
          />
        ) : (
          <a
            href={relativeUrl}
            class={clx(
              "btn",
              "btn-outline justify-center  !text-[12px] !font-medium px-0 no-animation w-full",
              "text-center border border-secondary btn-secondary min-h-0 h-[26px]"
            )}
          >
            Fora de estoque
          </a>
        )}
      </div> */
      }

      {
        /* <div>
        <a
          href={relativeUrl}
          aria-label="view product"
          class="btn btn-outline btn-primary h-[26px] min-h-0 w-full mt-2 font-medium text-[12px]"
        >
          Ver mais
        </a>
      </div> */
      }
    </div>
  );
}

export default ProductCardBuyTogether;
