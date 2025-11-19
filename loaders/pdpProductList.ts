import { Product } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/deco/vnda.ts";

export interface Props {
  /** @description total number of items to display */
  count: number;

  /** @description search sort parameter */
  sort?: "newest" | "oldest" | "lowest_price" | "highest_price";

  /** @description search for products that have certain tag */
  tags?: string[];

  /** @description Override to use specific tags instead of product tags */
  useSpecificTags?: boolean;

  /** @description Filter by specific tag type (categoria, subcategoria, etc) */
  tagType?: string;
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

  // 3. Define qual tag usar para busca (apenas 1 para trazer mais resultados)
  let tagToSearch: string | null = null;

  if (props.useSpecificTags && props.tags && props.tags.length > 0) {
    // Usa a primeira tag específica passada via props
    tagToSearch = props.tags[0];
  } else if (props.tagType) {
    // Se tagType foi especificado, usa a primeira tag desse tipo
    const filteredTag = productTags.find((tag) => tag.type === props.tagType);
    tagToSearch = filteredTag?.name || null;
  } else {
    // Estratégia de priorização: subcategoria > categoria > primeira tag
    const subcategoryTag = productTags.find((tag) => tag.type === "subcategoria");
    const categoryTag = productTags.find((tag) => tag.type === "categoria");
    
    if (subcategoryTag?.name) {
      tagToSearch = subcategoryTag.name;
    } else if (categoryTag?.name) {
      tagToSearch = categoryTag.name;
    } else {
      // Usa a primeira tag disponível
      tagToSearch = productTags[0]?.name || null;
    }
  }

  // Se não encontrou tag, retorna null
  if (!tagToSearch) return null;

  // 4. Busca produtos com a mesma tag
  const relatedProducts = await ctx.invoke.vnda.loaders.productList({
    count: props.count + 5, // Pega mais produtos para compensar filtros
    tags: [tagToSearch], // Usa apenas 1 tag
    sort: props.sort,
  });

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  // 5. Remove o produto atual dos resultados
  const filteredProducts = relatedProducts.filter(
    (product) => product.productID !== currentProduct.productID,
  );

  // 6. Limita ao count solicitado
  const finalProducts = filteredProducts.slice(0, props.count);

  return finalProducts.length > 0 ? finalProducts : null;
};

export default pdpProductList;