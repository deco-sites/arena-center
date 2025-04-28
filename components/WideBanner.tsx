import { type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "./ui/Section.tsx";

export interface Props {
  /**
   * @title Imagem do Banner
   * @description Inserir a imagem na largura especificada, a altura vai se ajustar automaticamente (mobile: largura 390px, desktop: 1440px)
   */
  images: {
    mobile: ImageWidget;
    desktop: ImageWidget;
  };
  /**
   * @description Descrição de acessibilidade e SEO
   */
  alt: string;
  /**
   * @description Link opcional
   */
  href?: string;
}

function Banner({ images, href, alt }: Props) {
  return (
    <a class="relative mx-auto w-screen hidden md:block" href={href}>
      <Picture>
        <Source
          media="(max-width: 640px)"
          src={images.mobile || images.desktop}
          width={390}
        />
        <Source
          media="(min-width: 640px)"
          src={images.desktop}
          width={1440}
          height={176}
          loading="lazy"
        />
        <img
          src={images.desktop}
          alt={alt}
          loading="lazy"
          class=" w-full  max-w-[1440px] px-6 mt-2 h-auto object-cover mx-auto"
        />
      </Picture>
    </a>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;

export default Banner;
