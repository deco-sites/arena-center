import { Product } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/deco/vnda.ts";

export interface Props {
  /** @description total number of items to display */
  count: number;
}

/**
 * @title VNDA Integration
 * @description Product List loader - Same Category (PDP)
 */
const pdpProductList = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Product[] | null> => {
  const url = new URL(req.url);

  // Extrai o slug da URL atual para buscar o produto
  const pathname = url.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // Pega o último segmento como slug do produto
  const slug = segments[segments.length - 1];

  if (!slug) return null;

  // Função para extrair ID do slug
  const parseSlug = (slug: string) => {
    const splitted = slug.split("-");
    const maybeId = Number(splitted[splitted.length - 1]);
    return !isNaN(maybeId) ? { id: maybeId } : null;
  };

  const fromSlug = parseSlug(slug);

  if (!fromSlug) return null;

  // 1. Busca o produto atual usando o loader correto
  const currentProductData = await ctx.invoke.vnda.loaders.productList({
    ids: [fromSlug.id],
    count: 1,
  });

  if (!currentProductData || currentProductData.length === 0) return null;

  const currentProduct = currentProductData[0];

  // 2. Extrai as tags do produto a partir de additionalProperty
  const productTags = currentProduct.additionalProperty
    ?.filter((prop) => prop.valueReference === "TAGS")
    .map((prop) => {
      try {
        const tagData = JSON.parse(prop.value || "{}");
        return {
          name: prop.name,
          type: tagData.type,
        };
      } catch {
        return { name: prop.name, type: null };
      }
    }) || [];

  const categoryTag = productTags.find((tag) => tag.type === "categoria")?.name;

  // Se não encontrou tags, retorna null
  if (!categoryTag) return null;

  const relatedProducts = await ctx.invoke.vnda.loaders.productListingPage({
    count: props.count,
    pageHref: `${url.origin}/${categoryTag}`,
  });

  if (!relatedProducts || relatedProducts.products.length === 0) {
    return null;
  }

  // 5. Remove o produto atual dos resultados
  const filteredProducts = relatedProducts.products.filter(
    (product) => product.productID !== currentProduct.productID,
  );

  // 6. Limita ao count solicitado
  const finalProducts = filteredProducts.slice(0, props.count);

  return finalProducts.length > 0 ? finalProducts : null;
};

export default pdpProductList;
