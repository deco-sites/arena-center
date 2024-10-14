import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Video from "apps/website/components/Video.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";
/**
 * @titleBy alt
 */
export interface Banner {
  /**
   * @title Contéudo do Banner
   */
  bannerType?: "video" | "imagem";
  lcp?: boolean;
  /** @description Texto alternativo e "promotion_name" no Data Layer */
  alt: string;
  /**
   * @title Titulo
   * @description Título do banner */
  title?: string;
  /**@title Se tiver um texto em cima da imagem, coloque aqui */
  text?: string;
  /**@title Se tiver paragraph coloque aqui */
  paragra?: string;
  /**
   * @title Link
   * @description Link de redirecionamento */
  href?: string;
  /** @description Imagem ou vídeo para desktop */
  desktop?: DesktopBanner;
  /** @description Imagem ou vídeo para mobile */
  mobile?: MobileBanner;
  /** @title Parametros de Data Layer */
  params?: DataLayerParams;
}
export interface DesktopBanner {
  /** @description se for usar GIFs, prefira usar vídeos */
  /** @title Vídeo*/
  video?: string;
  /** @title Imagem*/
  image?: ImageWidget;
  /** @title Largura*/
  width?: number;
  /** @title Altura*/
  height?: number;
}
export interface MobileBanner {
  /** @description se for usar GIFs, prefira usar vídeos */
  /** @title Vídeo*/
  video?: string;
  /** @title Imagem*/
  image?: ImageWidget;
  /** @title Largura*/
  width?: number;
  /** @title Altura*/
  height?: number;
}
type DataLayerParams = {
  promotion_id: string;
  creative_name: string;
  creative_slot: string;
};
export interface Autoplay {
  /** @description Ativar ou desativar o autoplay */
  activate?: boolean;
  /**
   * @title Intervalo do autoplay
   * @description Tempo (em segundo) do autoplay
   */
  interval?: number;
}
export interface Props {
  banners?: Banner[];
  /**
   * @description Marque esta opção quando esta imagem for a maior da página
   */
  preload?: boolean;
  /**
   * @title Mostrar setas
   * @description Mostrar os arrows para navegar nas imagens
   */
  arrows?: boolean;
  /**
   * @title Mostrar pontos de navegação
   * @description Mostrar os dots para navegar nas imagens
   */
  dots?: boolean;
  /**
   * @title Intervalo do autoplay
   * @description Tempo (em segundos) para iniciar a reprodução automática
   */
  autoplay?: Autoplay;
}
function BannerItem({ banner, device }: {
  banner: Banner;
  device: string;
}) {
  const { alt, bannerType, title, lcp, desktop, text, mobile } = banner;
  const deviceUseDevice = useDevice();
  const desktopSrc = desktop?.image ? desktop.image : "";
  const mobileSrc = mobile?.image ? mobile.image : "";
  const videoSrc = device === "mobile" ? mobile?.video : desktop?.video;
  const source = bannerType === "video"
    ? (
      <Video
        src={videoSrc || ""}
        autoplay
        width={device ? mobile?.width! : desktop?.width!}
        height={device ? mobile?.height! : desktop?.height!}
        loop
        muted
        class="border-none w-full"
      />
    )
    : (
      <Picture preload={lcp}>
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobileSrc}
          width={mobile?.width!}
          height={mobile?.height!}
        />
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktopSrc}
          width={desktop?.width!}
          height={desktop?.height!}
        />
        {deviceUseDevice === "mobile" && mobileSrc &&
          (
            <div class="relative">
              <img
                class="w-full h-full object-cover"
                title={title}
                loading={lcp ? "eager" : "lazy"}
                src={mobileSrc}
                alt={alt}
              >
                <div class="top-0 left-0 absolute flex flex-col justify-center items-center gap-y-4 w-full h-full">
                  <p class="text-5xl text-accent">{text}</p>
                  <p class="text-[18px] text-accent">{text}</p>
                </div>
              </img>
            </div>
          )}
        {deviceUseDevice === "desktop" && desktopSrc &&
          (
            <div class="relative">
              <img
                class="w-full h-full object-cover"
                title={title}
                loading={lcp ? "eager" : "lazy"}
                src={desktopSrc}
                alt={alt}
              >
                <div class="top-0 left-0 absolute flex flex-col justify-center items-center gap-y-4 w-full h-full">
                  <p class="text-5xl text-accent">{text}</p>
                  <p class="text-[18px] text-accent">{text}</p>
                </div>
              </img>
            </div>
          )}
      </Picture>
    );
  return (
    <a href={banner.href ?? "#"} class="relative w-full overflow-y-hidden">
      {source}
    </a>
  );
}
function Dots({ banners, autoplay }: Props) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @property --dot-progress {
            syntax: '<percentage>';
            inherits: false;
            initial-value: 0%;
          }
          `,
        }}
      />
      <ul class="z-10 justify-center gap-1 sm:gap-[10px] col-span-full row-start-4 mx-5 sm:mx-0 h-[88px] carousel">
        {banners?.map((_, index) => (
          <Slider.Dot index={index}>
            <li class="carousel-item">
              <div
                class={`w-full sm:w-24 h-0.5 rounded group-data-[painted]:bg-none group-data-[painted]:bg-white group-disabled:animate-progress bg-gradient-to-r from-white from-[length:var(--dot-progress)] to-[#f2f2f2]/[.5] to-[length:var(--dot-progress)]`}
                style={{
                  animationDuration: `${autoplay?.interval}s`,
                }}
              />
            </li>
          </Slider.Dot>
        ))}
      </ul>
    </>
  );
}
function Buttons() {
  return (
    <>
      <div class="z-10 flex justify-center items-center col-start-1 row-start-2">
        <Slider.PrevButton class="btn btn-circle glass">
          <Icon
            class="text-base-100"
            size={24}
            id="chevron-right"
            strokeWidth={3}
          />
        </Slider.PrevButton>
      </div>
      <div class="z-10 flex justify-center items-center col-start-3 row-start-2">
        <Slider.NextButton class="btn btn-circle glass">
          <Icon
            class="text-base-100"
            size={24}
            id="chevron-right"
            strokeWidth={3}
          />
        </Slider.NextButton>
      </div>
    </>
  );
}
function BannerCarousel(props: Props) {
  const id = useId();
  const { banners, autoplay } = { ...props };
  return (
    <div
      id={id}
      class="grid grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_48px_1fr_64px] min-h-[535px] sm:min-h-min"
    >
      <Slider class="col-span-full row-span-full w-full carousel carousel-center">
        {banners?.map((banner, index) => {
          return (
            <Slider.Item index={index} class="w-full carousel-item">
              <BannerItem banner={banner} device={useDevice()} />
            </Slider.Item>
          );
        })}
      </Slider>
      {props.arrows && <Buttons />}
      {props.dots && <Dots banners={banners} autoplay={autoplay} />}
      <Slider.JS
        rootId={id}
        interval={autoplay?.interval && autoplay.interval * 1e3}
        infinite
      />
    </div>
  );
}
export default BannerCarousel;
