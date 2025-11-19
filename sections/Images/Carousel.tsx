import type { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Video from "apps/website/components/Video.tsx";

export interface VideoSources {
  desktop?: VideoWidget;
  mobile?: VideoWidget;
}

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description desktop otimized image */
  desktop?: ImageWidget;

  /** @description mobile otimized image */
  mobile?: ImageWidget;

  /** @description video content sources - use para utilizar vídeo */
  videoContent?: VideoSources;

  /** @description Image's alt text */
  alt: string;

  action?: {
    /** @description when user clicks on the image, go to this link */
    href: string;
    /** @description Image text title */
    title: string;
    /** @description Image text subtitle */
    subTitle: string;
    /** @description Button label */
    label: string;
  };
}

export interface Props {
  images?: Banner[];

  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  preload?: boolean;

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function BannerItem({ image, lcp }: { image: Banner; lcp?: boolean }) {
  const { alt, mobile, desktop, action, videoContent } = image;
  const params = { promotion_name: image.alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  return (
    <a
      {...selectPromotionEvent}
      href={action?.href ?? "#"}
      aria-label={action?.label}
      class="block relative w-full h-full overflow-x-hidden max-h-[600px]"
    >
      {action && (
        <div
          class={clx(
            "absolute lg:h-full lg:w-full top-0 left-0 w-screen h-auto",
            "flex flex-col justify-center items-center",
            "px-5 sm:px-0",
            "sm:left-40 sm:items-start sm:max-w-96",
          )}
        >
          <span class="font-bold text-7xl text-base-100">{action.title}</span>
          <span class="pt-4 pb-12 font-normal text-base text-base-100">
            {action.subTitle}
          </span>
          <button
            type="button"
            class="border-0 bg-base-100 min-w-[180px] btn btn-outline btn-primary"
            aria-label={action.label}
          >
            {action.label}
          </button>
        </div>
      )}
      {/* Desktop Video */}
      {videoContent?.desktop
        ? (
          <Video
            class="hidden lg:block w-full h-full object-cover"
            src={videoContent.desktop}
            loading={lcp ? "eager" : "lazy"}
            width={1440}
            height={600}
            autoplay
            muted
            loop
          />
        )
        : null}
      {/* Mobile Video */}
      {videoContent?.mobile
        ? (
          <Video
            class="block lg:hidden w-full h-full object-cover"
            loading={lcp ? "eager" : "lazy"}
            src={videoContent.mobile}
            width={450}
            height={450}
            autoplay
            muted
            loop
          />
        )
        : null}
      {/* Mobile Image (only if no mobile video) */}
      {!videoContent?.mobile && mobile
        ? (
          <Picture
            preload={lcp}
            {...viewPromotionEvent}
            class="block lg:hidden w-full h-full"
          >
            <Source
              media="(max-width: 767px)"
              fetchPriority={lcp ? "high" : "auto"}
              src={mobile}
              width={450}
              height={450}
            />
            <img
              class="w-full h-full object-cover"
              loading={lcp ? "eager" : "lazy"}
              src={mobile}
              alt={alt}
            />
          </Picture>
        )
        : null}
      {/* Desktop Image (only if no desktop video) */}
      {!videoContent?.desktop && desktop
        ? (
          <Picture
            preload={lcp}
            {...viewPromotionEvent}
            class="hidden lg:block w-full h-full"
          >
            <Source
              media="(min-width: 768px)"
              fetchPriority={lcp ? "high" : "auto"}
              src={desktop}
              width={1440}
              height={600}
            />
            <img
              class="w-full h-full object-cover"
              loading={lcp ? "eager" : "lazy"}
              src={desktop}
              alt={alt}
            />
          </Picture>
        )
        : null}
    </a>
  );
}

function Carousel({ images = [], preload, interval }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class={clx(
        "grid",
        "grid-rows-[1fr_32px_1fr_64px]",
        "grid-cols-[32px_1fr_32px] ",
        "sm:grid-cols-[112px_1fr_112px] ",
        "w-full",
        "max-w-[1440px]",
        "mx-auto",
      )}
    >
      <div class="col-span-full row-span-full mb-[-7px]">
        <Slider class="w-full">
          {images.map((image, index) => (
            <Slider.Item index={index} class="w-full">
              <BannerItem image={image} lcp={index === 0 && preload} />
            </Slider.Item>
          ))}
        </Slider>
      </div>

      <div class="z-10 sm:flex justify-center mt-7 items-center col-start-1 row-start-2">
        <Slider.PrevButton>
          <Icon id="chevron-right" class="rotate-180" />
        </Slider.PrevButton>
      </div>

      <div class="z-10 justify-center mt-7 items-center col-start-3 row-start-2">
        <Slider.NextButton>
          <Icon id="chevron-right" />
        </Slider.NextButton>
      </div>

      <Slider.Dots>
        <Slider.Dot
          class={clx(
            "bg-black opacity-20 h-3 w-3 no-animation rounded-full hidden md:flex",
            "disabled:w-8 disabled:bg-base-100 disabled:opacity-100 transition-[width]",
          )}
        />
      </Slider.Dots>

      <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default Carousel;
