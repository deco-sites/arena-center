import { ProductDetailsPage } from "apps/commerce/types.ts";

interface Props {
  page: ProductDetailsPage | null;
}

function ProductDescription({ page }: Props) {
  if (page === null) {
    throw new Error("Missing Product Description Page Info");
  }

  const { product } = page;
  const { isVariantOf } = product;
  const description = product?.description || isVariantOf?.description;
  //const title = isVariantOf?.name ?? product.name;

  function processDescription(description: string) {
    // converter as linhas em branco
    description = description.replace(/\n/g, "<br>");

    return description;
  }

  return (
    <div class="lg:mt-12 collapse collapse-arrow px-4 mt-[-40px] lg:max-w-[800px] mx-auto">
      <input id="description" type="checkbox" class="min-h-[0]" />
      <label
        htmlFor="description"
        class="collapse-title min-h-[0]  flex gap-2 border-b border-gray-300 "
      >
        <p class="text-md font-medium mb-[-2px]">Descrição</p>
      </label>
      <div class="max-w-[1096px] mx-auto px-11 collapse-content">
        {description && (
          <div
            class="font-light text-accent text-[12px] mt-5"
            dangerouslySetInnerHTML={{
              __html: processDescription(description),
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ProductDescription;
