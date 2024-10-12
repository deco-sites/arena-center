import Image from "apps/website/components/Image.tsx";
import { MINICART_DRAWER_ID } from "../../constants.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
const onLoad = (id: string) =>
  window.STOREFRONT.CART.subscribe((sdk) => {
    const counter = document.getElementById(id);
    const count = sdk.getCart()?.items.length ?? 0;
    if (!counter) {
      return;
    }
    // Set minicart items count on header
    if (count === 0) {
      counter.classList.add("hidden");
    } else {
      counter.classList.remove("hidden");
    }
    counter.innerText = count > 9 ? "9+" : count.toString();
  });
function Bag() {
  const id = useId();
  return (
    <>
      <label
        class="indicator"
        for={MINICART_DRAWER_ID}
        aria-label="open cart flex flex-col"
      >
        <span
          id={id}
          class="hidden indicator-item badge badge-primary badge-sm left-8"
        />

        <div class="btn btn-ghost no-animation  text-secondary hover:border-primary flex flex-col">
          <Image
            id="shopping_bag"
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/arena-center/8ffcddc7-e6c9-4326-81f2-79c0abbee7a0/CART_02.svg"
            alt="icone de usuario"
            width={20}
            height={20}
          />
          <p class="text-[10px] text-accent-content">Carrinho</p>
        </div>
      </label>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </>
  );
}
export default Bag;
