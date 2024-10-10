import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "@deco/deco/hooks";

/** @titleBy title */
export interface TopItem {
  /**
   * @title Imagem
   * @description Tamanho da imagem (largura: 50px, altura: 50px) */
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
   */
  subtitle?: string;
}

interface Props {
  /**
   * @title Conteudo
   * @maximum 4 */
  content: TopItem[];
}

export default function TopBar({ content }: Props) {
  const device = useDevice();
  if (device !== "desktop") {
    return (
      <div class="flex items-center overflow-auto mx-auto md:mt-5 py-auto bg-primary w-screen md:max-w-[1440px] h-auto">
        {content.map((item) => (
          <a
            href={item.href}
            target="blank"
            class="flex items-center w-full mr-7 md:mr-0 ml-6 h-[200px]"
          >
            <div class="flex justify-center items-center w-[50px] h-[50px]">
              {item.mobileImage && (
                <Image
                  class="lg:w-[94px] w-full lg:h-[50px] flex-shrink-0 object-contain"
                  src={item.mobileImage}
                  alt={item.title}
                  width={94}
                  height={34}
                />
              )}
            </div>
            <div class="ml-6 w-[200px] text-base text-primary-content">
              <p class="mb-2 font-semibold text-xs">{item.title}</p>
              <p class="font-light text-xs">{item.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    );
  }
  return (
    <div class="flex md:justify-around items-center mx-auto mt-5 py-auto bg-primary lg:bg-primary-content w-screen md:max-w-[1440px] h-auto md:overflow-hidden">
      {content.map((item) => (
        <a
          href={item.href}
          target="blank"
          class="flex items-center mr-7 md:mr-0 ml-6 h-[200px]"
        >
          <div class="flex justify-center items-center w-[50px] h-[50px]">
            {item.image && (
              <Image
                class="lg:w-[94px] w-full lg:h-[50px] object-contain text-primary-content lg:text-secondary"
                src={item.image}
                alt={item.title}
                width={94}
                height={34}
              />
            )}
          </div>
          <div class="ml-6 w-[200px] text-base text-primary-content lg:text-secondary">
            <p class="mb-2 font-semibold text-xs">{item.title}</p>
            <p class="font-light text-xs">{item.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
