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

function CategorySlider({ categoryItems, itemListName }: Props) {
  const id = useId();

  return (
    <div class="mx-auto max-w-[1440px] flex flex-col gap-2 mt-8 px-0 md:px-6">
      <p class="text-accent-content md:text-primary text-lg font-semibold text-center">
        {itemListName}
      </p>
      <div
        id={id}
        class="grid grid-rows-1 w-full max-w-[1440px]"
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="col-span-3 col-start-1 row-span-1 mx-auto row-start-1 px-6 md:px-0 max-w-[1200px]">
          <Slider class="carousel carousel-center sm:carousel-end gap-2 w-full">
            {categoryItems?.map((item, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                  "first:pl-0 first:sm:pl-0",
                  "last:pr-0 last:sm:pr-0"
                )}
              >
                <div class="bg-secondary-content">
                  <a href={item.link}>
                    <Image
                      src={item.image}
                      width={295}
                      height={305}
                      class="w-[287px] sm:w-[295px] h-auto"
                    />
                    <p class="pt-[5px] text-xs pb-[7px] pl-[9px] h-[29px]">
                      {item.paragraph}
                    </p>
                  </a>
                </div>
              </Slider.Item>
            ))}
          </Slider>
        </div>
        <div class="relative bottom-[7%] z-10 col-span-1 col-start-1 row-span-1 row-start-1 p-2 self-center">
          <Slider.PrevButton class="sm:flex hidden disabled:opacity-0 no-animation">
            <Icon id="chevron-right" class="rotate-180 text-accent-content" />
          </Slider.PrevButton>
        </div>

        <div class="relative bottom-[7%] z-10 col-span-1 col-start-3 row-span-1 row-start-1 p-2 self-center">
          <Slider.NextButton class="sm:flex hidden disabled:opacity-50 no-animation">
            <Icon id="chevron-right" class="text-accent-content" />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId={id} />
    </div>
  );
}

export default CategorySlider;
