import type { ImageObject, ProductLeaf } from "apps/commerce/types.ts";

export interface VariantItem {
  image: ImageObject;
  url?: string;
  isSelected: boolean;
  sku: string;
}

export function useVariant(
  variants: ProductLeaf[],
  selected: ProductLeaf,
): VariantItem[] {
  const { sku: selectedSku } = selected;

  const variantsArray: VariantItem[] = variants.map(
    ({ url, image: images, sku }) => {
      const [image] = images ?? [];
      return ({
        url,
        image,
        isSelected: selectedSku === sku,
        sku,
      });
    },
  );

  return [...variantsArray].sort((a, b) => a.sku.localeCompare(b.sku));
}
