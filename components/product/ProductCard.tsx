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

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;
}

const WIDTH = 295;
const HEIGHT = 378;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();

  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {
    /* Add click event to dataLayer */
  }
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  //Added it to check the variant name in the SKU Selector later, so it doesn't render the SKU to "shoes size" in the Product Card
  const firstVariantName = firstSkuVariations?.[0]?.toLowerCase();
  const shoeSizeVariant = "shoe size";

  const shortDescription = description &&
    description?.replace(/<\/?p>|<br\s*\/?>/gi, "").slice(0, 85) + "...";

  return (
    <div
      {...event}
      class={clx(
        "card card-compact group text-sm lg:w-[280px] w-[170px] h-auto",
        _class,
      )}
    >
      <figure
        class={clx(
          "relative bg-base-100 lg:w-[280px] w-[170px]",
          "rounded border border-transparent",
          "group-hover:border-primary",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "absolute top-0 left-0",
            "grid grid-cols-1 grid-rows-1",
            "lg:w-[280px] w-[170px]",
            !inStock && "opacity-70",
          )}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={1000}
            height={1000}
            //style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-contain",
              "rounded lg:w-[280px] w-[175px]",
              "col-span-full row-span-full",
            )}
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={280}
            height={280}
            //style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-contain",
              "rounded w-[175px] lg:w-[280px]",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100",
            )}
            loading="lazy"
            decoding="async"
          />
        </a>

        <span
          class={clx(
            "absolute top-2 left-2",
            "text-[12px] font-normal text-base-100  bg-primary  text-center rounded-[4px] px-2 py-1",
            (percent < 1 || !inStock) && "opacity-0",
          )}
        >
          {percent} % off
        </span>
      </figure>

      <a href={relativeUrl} class="pt-4">
        <p class="font-base text-xs md:text-sm h-14 lg:h-10 line-clamp-2">
          {title}
        </p>

        <div class="flex gap-2 pt-2">
          {listPrice && (
            <span class="line-through font-normal text-gray-600 text-[10px]">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-semibold text-secondary text-[14px]">
            {formatPrice(price, offers?.priceCurrency)}
          </span>
        </div>
      </a>

      <div>
        {inStock
          ? (
            <AddToCartButton
              product={product}
              seller={seller}
              item={item}
              class={clx(
                "btn",
                "btn-outline justify-center border-gray-400 !text-sm !font-medium px-0 no-animation w-full min-h-0 h-7 mt-2",
                "hover:!bg-primary",
                "hover:!text-base-100",
              )}
            />
          )
          : (
            <a
              href={relativeUrl}
              class={clx(
                "btn",
                "btn-outline justify-start border-none text-center !text-sm !font-medium px-0 no-animation w-full h-29",
                "hover:!bg-transparent",
                "disabled:!bg-transparent disabled:!opacity-75",
                "btn-error hover:!text-error disabled:!text-error",
              )}
            >
              Fora de estoque
            </a>
          )}
      </div>
    </div>
  );
}

export default ProductCard;
