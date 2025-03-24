import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Slider from "site/components/ui/Slider.tsx";
import { useId } from "site/sdk/useId.ts";
import { clx } from "site/sdk/clx.ts";
import { useDevice } from "@deco/deco/hooks";

export interface Cards {
  src: ImageWidget;
  href?: string;
}

export interface Props {
  /** @maxItem images 4 */
  /** @description tamanho da imagem para celular largura 294px altura 625px */
  images?: Cards[];
  /** @maxItem 4 */
  /** @description tamanho da imagem para celular largura 270px altura 270px */
  imagesMobile: Cards[];
}

export default function (props: Props) {
  const id = useId();
  const isDesktop = useDevice() === "desktop";
  const Container = isDesktop ? "ul" : Slider;
  const Item = isDesktop ? "li" : Slider.Item;
  return (
    <div
      id={id}
      class="overflow-x-hidden max-md:pl-6 max-w-[1440px] lg:max-w-[1280px] mx-auto"
    >
      <Container class="flex gap-2 mt-6 mx-auto lg:justify-center">
        {props.images &&
          props.images.map((card, index) => (
            <Item
              class={clx(
                "!flex-none",
                "last:mr-2",
              )}
              index={index}
            >
              <a href={card.href}>
                <div class="lg:w-[294px] lg:h-[625px] w-[160px] h-auto">
                  <Image
                    class="object-cover "
                    src={card.src}
                    width={294}
                    height={625}
                  />
                </div>
              </a>
            </Item>
          ))}
      </Container>
      {!isDesktop && <Slider.JS rootId={id} infinite />}
    </div>
  );
}
