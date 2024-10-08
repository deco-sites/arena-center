import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

/** @titleBy title */
export interface TopItem {
  /**
   * @title Imagem
   * @description Tamanho da imagem (largura: 50px, altura: 50px) */
  image?: ImageWidget;
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
  return (
    <div class="flex md:justify-between items-center mx-auto mt-5 py-auto w-screen md:max-w-[1400px] h-auto md:overflow-hidden">
      {content.map((item) => (
        <a
          href={item.href}
          target="blank"
          class="flex items-center mr-7 md:mr-0 ml-6 h-[200px]"
        >
          <div class="flex justify-center items-center w-[50px] h-[50px]">
            {item.image && (
              <Image
                class="w-[94px] h-[50px] object-contain"
                src={item.image}
                alt={item.title}
                width={94}
                height={34}
              />
            )}
          </div>
          <div class="ml-6 w-[200px] text-base text-secondary">
            <p class="mb-2 font-semibold text-xs">{item.title}</p>
            <p class="font-light text-xs">{item.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
