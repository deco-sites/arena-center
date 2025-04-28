import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import S from "../components/ui/Section.tsx";
import { Product } from "apps/commerce/types.ts";
import ProductSliderCategorie from "../components/product/ProductSliderCategorie.tsx";
import { useDevice } from "@deco/deco/hooks";
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
  const device = useDevice();

  const productsArray = productList[index].products;
  const imagePrincipal = productList[index].image;
  const activeButtom = index;
  if (device !== "desktop") {
    return <div></div>;
  }
  return (
    <div class="container max-w-[1440px] mx-auto lg:mt-12 px-6">
      <div class="flex items-center mb-3 flex-col lg:flex-row">
        <p class="font-medium uppercase px-2 lg:mr-4 text-center mb-5 lg:mb-0">
          {title}
        </p>
        <div class=" flex gap-8 overflow-x-auto w-full">
          {productList.map((item, index) => (
            <button
              type="button"
              class={`${
                index === activeButtom
                  ? "bg-primary text-base-100"
                  : "bg-gray-200 text-accent-content"
              } bg-gray-200 w-36 text-center  uppercase border-none hover:bg-primary hover:text-base-100 p-2 rounded`}
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
        <div class=" w-[394px] h-[498px] hidden lg:flex">
          <a href={imagePrincipal.href} class=" gap-3">
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
          class="flex w-full overflow-x-hidden"
          id="product-slider-container"
        >
          {productsArray && <ProductSliderCategorie products={productsArray} />}
        </div>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <S.Placeholder height="640px" />;
export default CategoriesProductsShelf;
