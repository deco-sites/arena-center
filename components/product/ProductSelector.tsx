import { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useVariant } from "site/sdk/useVariant.ts";
import { clx } from "site/sdk/clx.ts";

export interface Props {
  product: Product;
}

function ProductSelector({ product }: Props) {
  const { isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const variants = useVariant(hasVariant, product);
  return (
    <div>
      <p class="text-[#222222] text-[12px] font-semibold mb-2">
        Escolha o modelo
      </p>
      <ul class="flex gap-2">
        {variants.filter(({ image }) => image.url).map((
          { image, isSelected, url },
        ) => (
          <li
            class={clx(
              "size-11 border",
              isSelected && "border-black",
              !isSelected && "border-gray-300",
            )}
          >
            <a class="size-full" href={url}>
              <Image
                class="size-[42px]"
                src={image!.url as string}
                width={100}
                height={100}
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductSelector;
