import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import SectionUi from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import type { IconItem } from "../../components/product/BuyTogetherComponent.tsx";
import BuyTogetherComponent from "../../components/product/BuyTogetherComponent.tsx";
import type { Product } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/site.ts";
import ShippingSimulationForm from "site/components/shipping/Form.tsx";
export interface Props {
  /** @title Integração */
  page: ProductDetailsPage | null;
  /**
   * @ignore
   */
  buyTogether: Product[] | null;
  /** @title icones de informação
   *  @description tamanho do icone largura 31px altura 31px
   * @maxItems 2
   */
  icons?: IconItem[];
}

export async function loader(props: Props, _req: Request, ctx: AppContext) {
  const products = await ctx.get({
    "__resolveType": "vnda/loaders/productList.ts",
    "tags": [],
    count: 1,
    "ids": [Number(props.page?.product.inProductGroupWithID)],
  }) as unknown as Product[];

  if (!products) {
    ctx.response.status = 404;
    return {
      ...props,
      page: null,
    };
  }

  const [productWithAdditionalProperty] = products;
  const tags = productWithAdditionalProperty?.additionalProperty?.filter(
    ({ name }) => {
      try {
        return name?.includes("compre-junto");
      } catch {
        return false; // Retorna falso se houver uma exceção ao analisar JSON
      }
    },
  ).map(({ name }) => name);
  const buyTogether = await ctx.get({
    "__resolveType": "vnda/loaders/productList.ts",
    "tags": tags,
  });

  return {
    ...props,
    buyTogether,
  };
}

export default function ProductDetails({ page, icons, buyTogether }: Props) {
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
    <div class="container flex flex-col gap-4 sm:gap-5 max-w-[1440px] py-4 sm:py-5 px-5 sm:px-24">
      <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />

      <div
        class={clx(
          "container grid",
          "grid-cols-1 gap-2 py-0",
          "sm:grid-cols-5 sm:gap-6",
        )}
      >
        <div class="sm:col-span-3">
          <ImageGallerySlider page={page} />
        </div>
        <div class="sm:col-span-2">
          <ProductInfo page={page} />
          <div class="">
            <ShippingSimulationForm
              items={[{
                id: Number(page.product.sku),
                quantity: 1,
                seller: "1",
              }]}
            />
          </div>
          <BuyTogetherComponent
            page={page}
            products={buyTogether}
            icons={icons}
          />
        </div>
      </div>
    </div>
  );
}
export const LoadingFallback = () => <SectionUi.Placeholder height="635px" />;
