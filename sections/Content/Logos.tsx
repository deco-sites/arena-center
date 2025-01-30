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
    <Section.Container class=" w-full">
      <div
        id={id}
        class="grid grid-rows-1 w-[full] lg:max-w-[1300px] mx-auto h-[96px] mt-5 "
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="col-span-3 col-start-1 row-span-1 mx-auto row-start-1 px-6 md:px-0 lg:max-w-[1200px] w-full">
          <Slider class="carousel carousel-center sm:carousel-end gap-10 lg:gap-16 lg:w-full w-[330px] first:pl-5">
            {images?.map((item, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                  "first:pl-0 first:sm:pl-0",
                  "last:pr-0 last:sm:pr-0"
                )}
              >
                <div class="">
                  <a href={item.href}>
                    <Image
                      src={item.image}
                      width={0}
                      height={48}
                      class=" h-12 w-auto"
                    />
                  </a>
                </div>
              </Slider.Item>
            ))}
          </Slider>
        </div>
        <div class="relative bottom-[25%] z-10 col-span-1 col-start-1 row-span-1 row-start-1 p-2 self-center lg:right-12 right-1">
          <Slider.PrevButton class="flex disabled:opacity-40 no-animation">
            <Icon id="chevron-right" class="rotate-180 text-accent-content" />
          </Slider.PrevButton>
        </div>
        <div class="relative bottom-[25%] z-10 col-span-1 col-start-3 row-span-1 row-start-1 p-2 self-center lg:left-12 left-1">
          <Slider.NextButton class="flex disabled:opacity-40 no-animation">
            <Icon id="chevron-right" class="text-accent-content" />
          </Slider.NextButton>
        </div>
      </div>

      <Slider.JS rootId={id} />
    </Section.Container>
  );
}

export default Logos;
