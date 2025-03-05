import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
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
  // const device = useDevice();
  return (
    <>
      <div class="custom-scroll flex gap-2 w-full max-w-[1440px] lg:overflow-visible mt-6 mx-auto px-6 lg:justify-center">
        {props.images &&
          props.images.map((card) => (
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
          ))}
      </div>
    </>
  );
}
