import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "@deco/deco/hooks";

/** @titleBy title */
export interface TopItem {
  /**
   * @title Imagem
   * @description Tamanho da imagem (largura: 50px, altura: 50px) */
  image: ImageWidget;
  greaterIcon?: boolean;
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
   */
  subtitle?: string;
}

interface Props {
  /**
   * @title Conteudo
   * @maxItem 4 */
  content: TopItem[];
}

export default function TopBar({ content }: Props) {
  const device = useDevice();
  if (device !== "desktop") {
    return (
      <div class="flex items-center overflow-auto mx-auto bg-primary w-screen px-4 md:max-w-[1440px]  h-auto">
        {content.map((item) => (
          <a
            href={item.href}
            target="blank"
            class="flex items-center w-full md:mr-0 ml-6 h-[100px]"
          >
            <div class="flex justify-center items-center w-[90px] h-[73px]">
              {item.mobileImage && (
                <Image
                  class="object-contain w-full h-full"
                  src={item.mobileImage}
                  alt={item.title}
                  width={item.greaterIcon ? 90 : 34}
                  height={34}
                />
              )}
            </div>
            <div class="w-[240px] px-2 text-base text-primary-content">
              <p class="font-normal text-xs">{item.title}</p>
              <p class="font-extralight text-xs">{item.subtitle}</p>
            </div>
          </a>
        ))}
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
                width={34}
                height={34}
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
