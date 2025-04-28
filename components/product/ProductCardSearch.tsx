import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import AddToCartButton from "./AddToCartButton.tsx";
import Tag from "site/components/ui/Tag.tsx";

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
const HEIGHT = 295;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {/* Add click event to dataLayer */ }
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

  return (
    <div
      {...event}
      class={clx(
        "card card-compact group text-sm min-w-[145px] min-h-[258px]",
        _class,
      )}
    >
      <figure
        class={clx(
          "relative bg-base-100  min-w-[145px] min-h-[145px]",
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
            "w-full",
            !inStock && "opacity-70",
          )}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={295}
            height={295}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-contain",
              "rounded w-full",
              "col-span-full row-span-full",
            )}
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={295}
            height={295}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-contain",
              "rounded w-full h-auto",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100",
            )}
            loading="lazy"
            decoding="async"
          />
        </a>
        {/* Discounts */}
        {percent > 0 && (
          <Tag text={`${percent} % off`} class="absolute z-30 top-2 left-2" />
        )}
      </figure>

      <a href={relativeUrl} class="pt-4">
        <div class="">
          <span class="font-medium text-xs md:text-sm line-clamp-2">
            {title}
          </span>
        </div>

        <div class="flex gap-2 pt-2">
          {listPrice && (
            <span class="line-through font-normal text-gray-600 text-[10px]">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-semibold text-secondary text-[12px]">
            {formatPrice(price, offers?.priceCurrency)}
          </span>
        </div>
      </a>

      {/* SKU Selector */}
      {
        /* {variants.length > 1 && firstVariantName !== shoeSizeVariant && (
        <ul class="flex items-center justify-start gap-2 pt-4 pb-1 pl-1 overflow-x-auto">
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

      <div class="flex-grow" />

      <div>
        {inStock
          ? (
            <AddToCartButton
              product={product}
              seller={seller}
              item={item}
              class={clx(
                "btn",
                "btn-outline justify-center border-gray-300 !text-sm !font-medium px-0 no-animation w-full",
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
                "btn-outline justify-start border-none !text-sm !font-medium px-0 no-animation w-full h-29",
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
