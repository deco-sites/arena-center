import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import S from "../components/ui/Section.tsx";
import { type Section } from "@deco/deco/blocks";
import { Product } from "apps/commerce/types.ts";
import ProductSlider from "../components/product/ProductSlider.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useOffer } from "../sdk/useOffer.ts";
import { useSendEvent } from "../sdk/useSendEvent.ts";
import { useSection } from "@deco/deco/hooks";
import { useComponent } from "../sections/Component.tsx";

/** @titleby title */
export interface ProductCategoryList {
  products: Product[] | null;
  /**@Categoria */
  title: string;
}

export interface Props {
  productList: ProductCategoryList[];
  image: {
    src: ImageWidget;
    alt?: string;
    href?: string;
  };
  title: string;
  index: number;
}

  

function CategoriesProductsShelf({ productList, image, title, index = 0 }: Props) {
  
  const products = productList[index].products ; 
  //  const viewItemListEvent = useSendEvent({
  //    on: "view",
  //    event: {
  //      name: "view_item_list",
  //      params: {
  //        item_list_name: title,
  //        items: products1.map((product, index) =>
  //          mapProductToAnalyticsItem({
  //            index,
  //            product,
  //            ...useOffer(product.offers),
  //          })
  //        ),
  //      },
  //    },
  //  });

  return (
    <div class="container max-w-[1440px] mx-auto mt-10 px-11">
      <div class="flex items-center mb-3">
        <p class="font-medium uppercase px-2 lg:mr-4">{title}</p>
        <div class=" flex gap-8">
          {productList.map((item, index) => (
            <button
              class=" bg-gray-200 text-center text-accent-content uppercase border-none hover:bg-primary hover:text-base-100 p-2 rounded"
              hx-get={useSection({ props: { index } })}
              hx-target="closest section"
              hx-swap="outerHTML"
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <div class="flex">
        <div class=" w-[394px] h-[498px] ">
          <a href={image.href} class="hidden lg:flex gap-3">
            <Image
              src={image.src}
              class="w-[394px] h-[498px] object-cover"
              width={394}
              height={498}
              alt={image.alt}
              fit="cover"
            />
          </a>
        </div>
        <div
          class="flex max-w-[calc(100%_-_394px)]"
          id="product-slider-container"
        >
          {products && <ProductSlider products={products} />}
        </div>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <S.Placeholder height="640px" />;
export default CategoriesProductsShelf;