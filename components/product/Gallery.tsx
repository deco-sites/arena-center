import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "./ProductImageZoom.tsx";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import Tag from "site/components/ui/Tag.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

const WIDTH = 820;
const HEIGHT = 820;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider(props: Props) {
  const id = useId();
  const zoomId = `${id}-zoom`;

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const {
    page: {
      product: { name, isVariantOf, image: pImages, offers },
    },
  } = props;

  // Filter images when image's alt text matches product name
  // More info at: https://community.shopify.com/c/shopify-discussions/i-can-not-add-multiple-pictures-for-my-variants/m-p/2416533
  const groupImages = isVariantOf?.image ?? pImages ?? [];
  const filtered = groupImages.filter((img) =>
    name?.includes(img.alternateName || "")
  );
  const images = filtered.length > 0 ? filtered : groupImages;
  const { price = 0, listPrice } = useOffer(offers);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;
  return (
    <>
      <div
        id={id}
        class="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-[min-content_1fr] gap-5"
      >
        {/* Image Slider */}
        <div class="col-start-1 col-span-1 sm:col-start-2">
          <div class="relative h-min flex">
            {percent > 0 && (
              <Tag
                text={`${percent} % off`}
                class="absolute z-30 top-2 left-2"
              />
            )}
            <Slider class="gap-2 md:w-[630px] md:h-[630px]">
              {images.map((img, index) => (
                <Slider.Item
                  index={index}
                  class="w-full md:h-[630px]"
                >
                  <Image
                    class="w-full bg-base-100 border border-base-400"
                    sizes="(max-width: 630px) 100vw, 40vw"
                    style={{ aspectRatio: ASPECT_RATIO }}
                    src={img.url!}
                    alt={img.alternateName}
                    width={630}
                    height={630}
                    // Preload LCP image for better web vitals
                    preload={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </Slider.Item>
              ))}
            </Slider>

            {images.length > 1 && (
              <Slider.PrevButton class="no-animation absolute left-0 top-1/2 disabled:opacity-50 bg-transparent border-none">
                <Icon id="chevron-right" class="rotate-180" />
              </Slider.PrevButton>
            )}

            {images.length > 1 && (
              <Slider.NextButton class="no-animation absolute right-0 top-1/2 disabled:opacity-50 bg-transparent border-none">
                <Icon id="chevron-right" />
              </Slider.NextButton>
            )}

            <div class="absolute top-2 right-8 bg-base-100 rounded-full">
              <label class="btn btn-ghost hidden sm:inline-flex" for={zoomId}>
                <Icon id="pan_zoom" />
              </label>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div class="col-start-1 col-span-1">
          <div
            class={clx(
              "carousel carousel-center",
              "sm:carousel-vertical",
              "gap-2",
              "max-w-full",
              "overflow-x-auto",
              "sm:overflow-y-auto",
            )}
            style={{ maxHeight: "600px" }}
          >
            {images.map((img) => (
              <li class="carousel-item w-16 h-16">
                <Slider.Dot>
                  <Image
                    style={{ aspectRatio: "1 / 1" }}
                    class="group-disabled:border-base-400 border rounded object-cover w-full h-full"
                    width={64}
                    height={64}
                    src={img.url!}
                    alt={img.alternateName}
                  />
                </Slider.Dot>
              </li>
            ))}
          </div>
        </div>

        <Slider.JS rootId={id} infinite controlDots />
      </div>
      <ProductImageZoom
        id={zoomId}
        images={images}
        width={700}
        height={Math.trunc((700 * HEIGHT) / WIDTH)}
      />
    </>
  );
}
