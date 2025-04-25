import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import AddToCartButtonPDP from "./AddToCartButtonPDP.tsx";
import OutOfStock from "./OutOfStock.tsx";
interface Props {
  page: ProductDetailsPage | null;
}
function ProductInfo({ page }: Props) {
  const id = useId();
  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }
  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const { price = 0, listPrice, seller = "1", availability } = useOffer(offers);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;
  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };
  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });
  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });
  return (
    <div {...viewItemEvent} class="flex flex-col" id={id}>
      {/* Price tag */}
      <span
        class={clx(
          "text-sm/4 font-normal text-black bg-primary bg-opacity-15 text-center rounded-badge px-2 py-1",
          percent < 1 && "opacity-0",
          "w-fit",
        )}
      >
        {percent} % off
      </span>

      {/* Product Name */}
      <h1 class={clx("text-lg font-light")}>{title}</h1>

      {/* Product id */}
      <span class={clx("text-[10px] font-light")}>{productID}</span>

      {/* Prices */}
      <div class="flex gap-3 pt-1">
        {percent !== 0 && (
          <span class="line-through text-sm font-medium text-gray-400">
            {formatPrice(listPrice, offers?.priceCurrency)}
          </span>
        )}
        <span class="text-xl font-semibold text-secondary">
          {formatPrice(price, offers?.priceCurrency)}
        </span>
      </div>

      {/* Sku Selector */}
      {
        /* {hasValidVariants && (
        <div className="mt-4 sm:mt-8">
          <ProductSelector product={product} />
        </div>
      )} */
      }

      {/* Add to Cart and Favorites button */}
      <div class="mt-4 sm:mt-10 flex flex-col gap-2">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              <AddToCartButtonPDP
                item={item}
                seller={seller}
                product={product}
                class="btn btn-secondary no-animation btn-outline w-full h-8 min-h-0"
                disabled={false}
              />
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>

      {/* Shipping Simulation */}
      {
        /* <div class="mt-8">
        <ShippingSimulationForm
          items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
        />
      </div> */
      }
    </div>
  );
}
export default ProductInfo;
