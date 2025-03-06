import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "@deco/deco/hooks";
import { useId } from "../sdk/useId.ts";
import Slider from "../components/ui/Slider.tsx";
import { clx } from "../sdk/clx.ts";
import Icon from "../components/ui/Icon.tsx";

/** @titleBy title */
export interface TopItem {
  /**
   * @title Imagem
   * @description Tamanho da imagem (largura: 32px, altura: 32px) */
  image: ImageWidget;
  /**
   * @title Imagem Mobile
   * @description Tamanho da imagem (largura: 50px, altura: 50px) */
  mobileImage: ImageWidget;
  /**
   * @title Link
   */
  href?: string;
  /**
   * @title Título
   */
  title: string;
  /**
   * @title Subtitulo
   * @maxLength 73
   */
  subtitle?: string;
}

interface Props {
  /**
   * @title Conteudo
   * @maxItem 4 */
  content: TopItem[];
  interval?: number;
}

export default function TopBar({ content, interval = 3 }: Props) {
  const id = useId();
  const device = useDevice();
  if (device !== "desktop") {
    return (
      <div class="flex items-center overflow-x-auto mx-auto bg-primary w-screen lg:px-4 md:max-w-[1440px] h-[73px] ">
        <div
          id={id}
          class={clx(
            "grid",
            "grid-rows-[1fr_32px_1fr_64px]",
            "grid-cols-[32px_1fr_32px] ",
            "sm:grid-cols-[112px_1fr_112px] ",
            "w-screen",
            "max-w-[1440px]",
            "mx-auto h-[73px] ",
          )}
        >
          <div class="col-span-full row-span-full  flex items-center justify-center h-[73px]">
            <Slider class="w-full carousel carousel-center ">
              {content.map((item, index) => (
                <Slider.Item
                  index={index}
                  class="w-full carousel-item h-auto overflow-y-hidden "
                >
                  <a
                    href={item.href}
                    target="blank"
                    class="flex items-center w-full justify-center"
                  >
                    <div class="flex justify-center items-">
                      {item.mobileImage && (
                        <Image
                          class="object-contain w-8 h-8"
                          src={item.mobileImage}
                          alt={item.title}
                          width={32}
                          height={32}
                        />
                      )}
                    </div>
                    <div class="w-auto px-2 text-base text-primary-content">
                      <p class="font-normal text-xs">{item.title}</p>
                      <p class="font-extralight text-xs">{item.subtitle}</p>
                    </div>
                  </a>
                </Slider.Item>
              ))}
            </Slider>
          </div>

          {
            /* <div class="z-10 sm:flex justify-center mt-7 items-center col-start-1 row-start-2">
        <Slider.PrevButton class="" disabled={false}>
          <Icon id="chevron-right" class="rotate-180" />
        </Slider.PrevButton>
      </div>

      <div class="z-10 justify-center mt-7 items-center col-start-3 row-start-2">
        <Slider.NextButton class="" disabled={false}>
          <Icon id="chevron-right" />
        </Slider.NextButton>
      </div>

      <ul
        class={clx()
        // "col-span-full row-start-4 z-10",
        // "carousel justify-center gap-3",
        }
      >
        {content.map((_, index) => (
          <li class="carousel-item">
            <Slider.Dot
              index={index}
              class={clx(
                "bg-black opacity-20 h-3 w-3 no-animation rounded-full  hidden md:flex",
                "disabled:w-8 disabled:bg-base-100 disabled:opacity-100 transition-[width]"
              )}
            >
              <></>
            </Slider.Dot>
          </li>
        ))}
      </ul> */
          }

          <Slider.JS
            rootId={id}
            interval={interval && interval * 1e3}
            infinite
          />
        </div>
      </div>
    );
  }
  return (
    <div class="flex md:justify-around items-center mx-auto bg-primary lg:bg-primary-content w-screen md:max-w-[1440px] h-auto md:overflow-hidden">
      {content.map((item) => (
        <a
          href={item.href}
          target="blank"
          class="flex items-center mr-7 md:mr-0 ml-6"
        >
          <div class="flex justify-center items-center">
            {item.image && (
              <Image
                class="lg:w-[34px] w-full lg:h-[34px] object-contain text-primary-content lg:text-secondary"
                src={item.image}
                alt={item.title}
                width={32}
                height={32}
              />
            )}
          </div>
          <div class="ml-3 w-[200px] text-base text-primary-content lg:text-secondary">
            <p class="text-[10px]">{item.title}</p>
            <p class="font-extralight text-[10px]">{item.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
