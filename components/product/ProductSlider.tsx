import { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products: Product[];
  itemListName?: string;
}

function ProductSlider({ products, itemListName }: Props) {
  const id = useId();

  return (
    <>
      <div
        id={id}
        class="max-w-[1440px] w-full lg:mx-auto flex justify-center max-lg:overflow-x-hidden relative"
      >
        <div
          class={clx(
            "z-10 self-center p-2 -translate-y-1/2 top-1/2",
            "lg:relative lg:left-[-30px]",
            "max-lg:absolute max-lg:left-0",
          )}
        >
          <Slider.PrevButton class="flex disabled:opacity-40 cursor-pointer">
            <Icon id="chevron-right" class="rotate-180 text-accent-content" />
          </Slider.PrevButton>
        </div>
        <div class="w-full lg:max-w-[1280px]">
          <Slider class="gap-4 sm:gap-5 mx-auto">
            {products?.map((product, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "!flex-none",
                  // "first:pl-12 first:sm:pr-0",
                  "last:mr-4 last:sm:mr-5",
                )}
              >
                <ProductCard
                  index={index}
                  product={product}
                  itemListName={itemListName}
                  class="lg:w-[287px] w-[170px] "
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div
          class={clx(
            "z-10 self-center p-2 -translate-y-1/2 top-1/2",
            "max-lg:absolute lg:relative",
            "max-lg:right-0 lg:right-[-30px]",
          )}
        >
          <Slider.NextButton class="flex disabled:opacity-40 cursor-pointer">
            <Icon id="chevron-right" class=" text-accent-content" />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId={id} infinite />
    </>
  );
}

export default ProductSlider;
