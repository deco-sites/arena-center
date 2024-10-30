import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import S from "../components/ui/Section.tsx";
import { Product } from "apps/commerce/types.ts";
import ProductSlider from "../components/product/ProductSlider.tsx";

import { useSection } from "@deco/deco/hooks";

/** @titleby title */
export interface ProductCategoryList {
  products: Product[] | null;
  /**@title Nome da Categoria */
  title: string;
  image: {
    src: ImageWidget;
    alt?: string;
    href?: string;
  };
}

export interface Props {
  productList: ProductCategoryList[];

  title: string;
  /** @hide index */
  index: number;
}

function CategoriesProductsShelf({ productList, title, index = 0 }: Props) {
  const productsArray = productList[index].products;
  const imagePrincipal = productList[index].image;

  return (
    <div class="container max-w-[1440px] mx-auto mt-12 px-11">
      <div class="flex items-center mb-3">
        <p class="font-medium uppercase px-2 lg:mr-4">{title}</p>
        <div class=" flex gap-8">
          {productList.map((item, index) => (
            <button
              class=" bg-gray-200 w-36 text-center text-accent-content uppercase border-none hover:bg-primary hover:text-base-100 p-2 rounded"
              hx-get={useSection({ props: { index } })}
              hx-target="closest section"
              hx-swap="outerHTML"
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <div class="flex mt-8">
        <div class=" w-[394px] h-[498px] ">
          <a href={imagePrincipal.href} class="hidden lg:flex gap-3">
            <Image
              src={imagePrincipal.src}
              class="w-[394px] h-[498px] object-cover"
              width={394}
              height={498}
              alt={imagePrincipal.alt}
              fit="cover"
            />
          </a>
        </div>

        <div
          class="flex max-w-[calc(100%_-_394px)]"
          id="product-slider-container"
        >
          {productsArray && <ProductSlider products={productsArray} />}
        </div>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <S.Placeholder height="640px" />;
export default CategoriesProductsShelf;
