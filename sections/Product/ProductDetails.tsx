import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import SectionUi from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import type { IconItem } from "../../components/product/BuyTogetherComponent.tsx";
import type { Section } from "deco/blocks/section.ts";
import BuyTogetherComponent from "../../components/product/BuyTogetherComponent.tsx";
import type { Product } from "apps/commerce/types.ts";

export interface Props {
  /** @title Integração */
  page: ProductDetailsPage | null;
  products: Product[] | null;
  sections?: Section[];
  /** @title icones de informação
   *  @description tamanho do icone largura 31px altura 31px
   * @maxItems 2
   */
  icons?: IconItem[];
}

export default function ProductDetails({ page, icons, products }: Props) {
  /**
   * Rendered when a not found is returned by any of the loaders run on this page
   */
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Page not found</span>
          <a href="/" class="btn no-animation">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="container flex flex-col gap-4 sm:gap-5 max-w-[1440px] py-4 sm:py-5 px-5 sm:px-0">
      <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />

      <div
        class={clx(
          "container grid",
          "grid-cols-1 gap-2 py-0",
          "sm:grid-cols-5 sm:gap-6"
        )}
      >
        <div class="sm:col-span-3">
          <ImageGallerySlider page={page} />
        </div>
        <div class="sm:col-span-2">
          <ProductInfo page={page} />
          <BuyTogetherComponent page={page} products={products} icons={icons} />
        </div>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <SectionUi.Placeholder height="635px" />;
