import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}
const onClick = () => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement | null;
  const container = button!.closest<HTMLDivElement>("div[data-cart-item]")!;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!),
  );
  const totalValue = document.getElementById(
    "productDetailValue",
  ) as HTMLInputElement;
  platformProps.quantity = totalValue.valueAsNumber;
  window.STOREFRONT.CART.addToCart(item, platformProps);
};

const onChange = () => {
  const input = event!.currentTarget as HTMLInputElement;
  const productID = input!
    .closest("div[data-cart-item]")!
    .getAttribute("data-item-id")!;
  const quantity = Number(input.value);
  if (!input.validity.valid) {
    return;
  }
  window.STOREFRONT.CART.setQuantity(productID, quantity);
};
// Copy cart form values into AddToCartButton
const onLoad = (id: string) => {
  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(id);
    // const checkbox = container?.querySelector<HTMLInputElement>(
    //   'input[type="checkbox"]',
    // );
    const input = container?.querySelector<HTMLInputElement>(
      'input[type="number"]',
    );
    const itemID = container?.getAttribute("data-item-id")!;
    const quantity = sdk.getQuantity(itemID) || 0;
    // if (!input || !checkbox) {
    //   return;
    // }
    // input.value = quantity.toString();
    // checkbox.checked = quantity > 0;
    // enable interactivity
    container?.querySelectorAll<HTMLButtonElement>("button").forEach((node) =>
      node.disabled = false
    );
    container?.querySelectorAll<HTMLButtonElement>("input").forEach((node) =>
      node.disabled = false
    );
    return;
  });
};
const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;

  if (platform === "vnda") {
    return {
      quantity: 1,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
};
function AddToCartButton(props: Props) {
  const { product, item, class: _class } = props;
  const platformProps = useAddToCart(props);
  const id = useId();

  return (
    <div>
      {/* Quantity Input */}
      <div class=" z-1">
        <QuantitySelector
          min={0}
          max={100}
          value={1}
          hx-on:change={useScript(onChange)}
          id={"productDetailValue"}
        />
      </div>
      <div
        id={id}
        class="flex mt-6  "
        data-item-id={product.productID}
        data-cart-item={encodeURIComponent(
          JSON.stringify({ item, platformProps }),
        )}
      >
        {/* <input type="checkbox" class="hidden peer" /> */}

        <button
          class={clx(
            "flex-grow uppercase btn btn-secondary min-h-0 h-7 !text-base-100 bg-secondary",
            _class?.toString(),
          )}
          hx-on:click={useScript(onClick)}
          disabled={false}
        >
          comprar
        </button>

        <script
          type="module"
          dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
        />
      </div>
      <div
        id={id}
        class="flex mt-2"
        data-item-id={product.productID}
        data-cart-item={encodeURIComponent(
          JSON.stringify({ item, platformProps }),
        )}
      >
        {/* <input type="checkbox" class="hidden peer" /> */}

        <button
          class={clx(
            "flex-grow uppercase btn btn-outline no-animation w-full",
            _class?.toString(),
          )}
          hx-on:click={useScript(onClick)}
          disabled={false}
        >
          Adicionar ao carrinho
        </button>

        <script
          type="module"
          dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
        />
      </div>
    </div>
  );
}
export default AddToCartButton;
