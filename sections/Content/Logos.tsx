import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

import { clx } from "../../sdk/clx.ts";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import Section from "../../components/ui/Section.tsx";

export interface Image {
  image: ImageWidget;
  alt: string;
  href: string;
}

export interface Props {
  images?: Image[];
}

function Logos({ images }: Props) {
  const id = useId();
  return (
    <Section.Container class="w-full overflow-x-hidden">
      <div
        id={id}
        class="grid grid-rows-1 w-[full] lg:max-w-[1300px] mx-auto mt-5 "
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="col-span-3 col-start-1 row-span-1 mx-auto row-start-1 px-6 md:px-0 lg:max-w-[1200px] w-full">
          <Slider class="gap-6 lg:gap-16 lg:w-full w-[330px]">
            {images?.map((item, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "!flex-none",
                  "last:mr-10 last:lg:mr-16",
                )}
              >
                <div class="">
                  <a href={item.href}>
                    <Image
                      src={item.image}
                      width={224}
                      height={224}
                      class="h-28 w-28 lg:h-[186px] lg:w-[186px]"
                    />
                  </a>
                </div>
              </Slider.Item>
            ))}
          </Slider>
        </div>
        <div class="relative z-10 col-span-1 col-start-1 row-span-1 row-start-1 p-2 self-center lg:right-12 -left-3 -ml-[20px]">
          <Slider.PrevButton class="flex disabled:opacity-40 no-animation">
            <Icon id="chevron-right" class="rotate-180 text-accent-content" />
          </Slider.PrevButton>
        </div>
        <div class="relative z-10 col-span-1 col-start-3 row-span-1 row-start-1 p-2 self-center lg:left-12 -right-3">
          <Slider.NextButton class="flex disabled:opacity-40 no-animation">
            <Icon id="chevron-right" class="text-accent-content" />
          </Slider.NextButton>
        </div>
      </div>

      <Slider.JS rootId={id} infinite />
    </Section.Container>
  );
}

export default Logos;
