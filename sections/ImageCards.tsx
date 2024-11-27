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
  const device = useDevice();
  return (
    <>
      {device === "desktop" && (
        <div class="flex flex-row gap-10 md:gap-4 text-white w-full max-w-[1440px] overflow-auto lg:overflow-visible mt-16 lg:mt-6 mx-auto px-6 justify-center">
          {props.images &&
            props.images.map((card) => (
              <a href={card.href}>
                <div class="flex flex-col">
                  <Image
                    class=" w-[294px] h-[625px]"
                    src={card.src}
                    width={294}
                    height={625}
                  />
                </div>
              </a>
            ))}
        </div>
      )}
      {device === "mobile" && (
        <div class="carousel  w-full my-12 ">
          {props.imagesMobile &&
            props.imagesMobile.map((card, index) => (
              <a
                href={card.href}
                key={index}
                class="carousel-item "
              >
                <Image
                  class="ml-8 w-[270px] h-[270px] object-contain"
                  alt={`Image ${index + 1}`}
                  src={card.src}
                  width={270}
                  height={270}
                  fit="contain"
                />
              </a>
            ))}
        </div>
      )}
    </>
  );
}

