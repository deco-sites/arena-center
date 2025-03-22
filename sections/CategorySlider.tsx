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
    <div class="mx-auto max-w-[1440px] flex flex-col gap-2 mt-8 custom-container">
      <p class="text-accent-content md:text-primary text-lg max-md:text-base font-semibold text-center">
        {itemListName}
      </p>
      <div
        id={id}
        class="grid grid-rows-1 w-full"
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="col-span-3 col-start-1 row-span-1 mx-auto row-start-1 md:px-0 max-w-[1200px]">
          <Slider class="gap-2 w-full">
            {categoryItems?.map((item, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "!flex-none",
                  "last:mr-2",
                  "first:pl-0 first:sm:pl-0",
                  "last:pr-0 last:sm:pr-0",
                )}
              >
                <div class="h-full">
                  <a class="flex flex-col h-full" href={item.link}>
                    <Image
                      src={item.image}
                      width={295}
                      height={305}
                      class="w-[287px] sm:w-[295px] h-full"
                    />
                    <p class="pt-[5px] text-xs pb-[7px] pl-[9px] h-[29px] bg-secondary-content">
                      {item.paragraph}
                    </p>
                  </a>
                </div>
              </Slider.Item>
            ))}
          </Slider>
        </div>
        <div class="relative bottom-[7%] z-10 col-span-1 col-start-1 row-span-1 row-start-1 p-2 self-center ">
          <Slider.PrevButton class="flex  disabled:opacity-40 no-animation ">
            <Icon id="chevron-right" class="rotate-180 text-accent-content" />
          </Slider.PrevButton>
        </div>

        <div class="relative bottom-[7%] z-10 col-span-1 col-start-3 row-span-1 row-start-1 p-2 self-center">
          <Slider.NextButton class="flex disabled:opacity-40 no-animation ">
            <Icon id="chevron-right" class="text-accent-content " />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId={id} infinite />
    </div>
  );
}

export default CategorySlider;
