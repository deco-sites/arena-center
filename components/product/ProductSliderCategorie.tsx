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
        class="grid grid-rows-1 lg:px-11 px-0 overflow-x-auto max-w-[1095px]"
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="col-start-1 col-span-3 row-start-1 row-span-1 w-full">
          <Slider class="carousel carousel-center  gap-7 sm:gap-6 max-w-[980px] mx-auto">
            {products?.map((product, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                  "first:pl-5 sm:pl-0",
                  "last:pr-5 last:sm:pr-0",
                )}
              >
                <ProductCard
                  index={index}
                  product={product}
                  itemListName={itemListName}
                  class="w-[287px] sm:w-[300px]"
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div class="col-start-1 col-span-1 row-start-1 row-span-1 z-10 self-center p-1 relative bottom-[15%] right-12">
          <Slider.PrevButton class="hidden sm:flex disabled:opacity-40 cursor-pointer ">
            <Icon id="chevron-right" class="rotate-180 text-accent-content" />
          </Slider.PrevButton>
        </div>

        <div class="col-start-3 col-span-1 row-start-1 row-span-1 z-10 self-center p-1 relative bottom-[15%] left-14">
          <Slider.NextButton class="hidden sm:flex disabled:opacity-40 cursor-pointer">
            <Icon id="chevron-right" class=" text-accent-content" />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId={id} />
    </>
  );
}

export default ProductSlider;
