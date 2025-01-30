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
        class=" max-w-[1440px] w-full lg:mx-auto flex justify-center"
        // style={{
        //   gridTemplateColumns: "min-content 1fr min-content",
        // }}
      >
        <div class="z-10 self-center p-2 relative left-[30px] lg:left-0 ">
          <Slider.PrevButton class=" flex disabled:opacity-40 cursor-pointer ">
            <Icon id="chevron-right" class="rotate-180 text-accent-content" />
          </Slider.PrevButton>
        </div>
        <div class="">
          <Slider class="carousel carousel-center  gap-7 sm:gap-5 lg:w-[1220px] w-[350px] mx-auto">
            {products?.map((product, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item"
                  // "first:pl-12 first:sm:pr-0",
                  // "last:pr-12 last:sm:pr-0"
                )}
              >
                <ProductCard
                  index={index}
                  product={product}
                  itemListName={itemListName}
                  class="lg:w-[287px] w-[175px] "
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div class="z-10 self-center p-2 relative bottom-[15%] right-[30px] lg:right-0">
          <Slider.NextButton class="flex disabled:opacity-40 cursor-pointer">
            <Icon id="chevron-right" class=" text-accent-content" />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId={id} />
    </>
  );
}

export default ProductSlider;
