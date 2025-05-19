import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Tag from "site/components/ui/Tag.tsx";

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
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const relativeUrl = relative(url);
  const percent = listPrice && offers?.lowPrice
    ? Math.round(((listPrice - offers?.lowPrice) / listPrice) * 100)
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
        items: [item],
      },
    },
  });

  return (
    <div
      {...event}
      class={clx("card card-compact group text-[10px]   ", _class)}
    >
      <figure
        class={clx("relative bg-base-100", "rounded  w-[143px]", "mx-auto")}
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
              "transition-opacity opacity-0 lg:group-hover:opacity-100 ",
            )}
            loading="lazy"
            decoding="async"
          />
        </a>

        {percent > 0 && (
          <Tag text={`${percent} % off`} class="absolute z-30 top-2 left-2" />
        )}
      </figure>

      <a href={relativeUrl} class="pt-5 flex flex-col items-center w-[143px]">
        <span class="font-medium text-sm text-secondary text-center h-16 w-[143px] overflow-y-auto">
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
    </div>
  );
}

export default ProductCardBuyTogether;
