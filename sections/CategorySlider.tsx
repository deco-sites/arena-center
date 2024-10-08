import { clx } from "../sdk/clx.ts";
import Icon from "../components/ui/Icon.tsx";
import Slider from "../components/ui/Slider.tsx";
import { useId } from "../sdk/useId.ts";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface CategoryItems {
  image: ImageWidget;
  paragraph: string;
  link: string;
}

interface Props {
  itemListName?: string;
  categoryItems?: CategoryItems[];
}

function CategorySlider({ categoryItems }: Props) {
  const id = useId();

  return (
    <>
      <div
        id={id}
        class="grid grid-rows-1"
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="col-span-3 col-start-1 row-span-1 row-start-1">
          <Slider class="carousel carousel-center sm:carousel-end gap-5 sm:gap-10 w-full">
            {categoryItems?.map((item, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                  "first:pl-5 first:sm:pl-0",
                  "last:pr-5 last:sm:pr-0",
                )}
              >
                <div class="bg-secondary-content">
                  <a href={item.link}>
                    <Image
                      src={item.image}
                      width={294}
                      height={305}
                      class="w-[287px] sm:w-[300px]"
                    />
                    <p class="pt-[5px] pb-[7px] pl-[9px]">{item.paragraph}</p>
                  </a>
                </div>
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div class="relative bottom-[15%] z-10 col-span-1 col-start-1 row-span-1 row-start-1 p-2 self-center">
          <Slider.PrevButton class="sm:flex hidden disabled:invisible btn btn-circle btn-outline btn-sm no-animation">
            <Icon id="chevron-right" class="rotate-180" />
          </Slider.PrevButton>
        </div>

        <div class="relative bottom-[15%] z-10 col-span-1 col-start-3 row-span-1 row-start-1 p-2 self-center">
          <Slider.NextButton class="sm:flex hidden disabled:invisible btn btn-circle btn-outline btn-sm no-animation">
            <Icon id="chevron-right" />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId={id} />
    </>
  );
}

export default CategorySlider;
