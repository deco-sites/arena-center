import { Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { Item } from "../minicart/Item.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  products: Product[];
  icon: string;
}
const onClick = () => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement | null;
  const container = button!.closest<HTMLDivElement>("div[data-cart-item]")!;
  const { items, platformProps = [] } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!),
  ) as {
    items: Item[];
    platformProps: ReturnType<typeof useAddToCart>;
  };
  items.forEach((item, index) => {
    window.STOREFRONT.CART.addToCart(item, platformProps?.[index]);
  });
};
const useAddToCart = ({ products }: Props) => {
  const platform = usePlatform();
  if (platform === "vnda") {
    const items = products.map((item) => ({
      itemId: item.productID,
      quantity: 1,
      atributes: Object.fromEntries(
        item.additionalProperty?.map(({ name, value }) => [name, value]) || [],
      ),
    }));
    return items;
  }
  return null;
};
function AddToCartButton(props: Props) {
  const { products, class: _class, icon } = props;
  const platformProps = useAddToCart(props);
  const id = useId();
  const items = products.map((item) => {
    const { price, listPrice } = useOffer(item.offers);
    return mapProductToAnalyticsItem({
      product: item,
      price,
      listPrice,
    });
  });
  return (
    <div
      id={id}
      class="flex"
      data-cart-item={encodeURIComponent(
        JSON.stringify({ items, platformProps }),
      )}
    >
      <button
        class={clx(
          "flex  w-[176px] h-[32px] text-base-200 min-h-0 btn bg-gray-300 border-none ",
          _class?.toString(),
        )}
        hx-on:click={useScript(onClick)}
        disabled={false}
      >
        <span class="text-black font-medium text-[14px] text-center w-full  hover:text-base-100 flex justify-center items-center ">
          {icon !== "" && (
            <img
              class="mr-1"
              src={icon}
              alt="icone de um carrinho de compras"
            />
          )}
          COMPRE JUNTO
        </span>
      </button>
    </div>
  );
}
export default AddToCartButton;
