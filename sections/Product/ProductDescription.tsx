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
  const description = product.description || isVariantOf?.description;
  //const title = isVariantOf?.name ?? product.name;

  function processDescription(description: string) {
    // converter as linhas em branco
    description = description.replace(/\n/g, "<br>");

    return description;
  }

  return (
    <div class="mt-12">
      <div class="max-w-[1096px] mx-auto px-11">
        {description && (
          <div
            class="font-light text-accent text-[12px]"
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
