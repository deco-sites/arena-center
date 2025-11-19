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

  // 3. Define quais tags usar para busca com estratégia em cascata
  let tagsToSearch: string[] = [];
  let searchStrategy = "custom";

  if (props.useSpecificTags && props.tags && props.tags.length > 0) {
    // Usa tags específicas passadas via props
    tagsToSearch = props.tags;
    searchStrategy = "props";
  } else {
    // Estratégia 1: Tenta usar subcategoria primeiro (mais específico)
    const subcategoryTags = productTags.filter((tag) =>
      tag.type === "subcategoria"
    );

    if (subcategoryTags.length > 0) {
      tagsToSearch = subcategoryTags.map((tag) => tag.name).filter((name): name is string => typeof name === "string");
      searchStrategy = "subcategoria";
    } else {
      // Estratégia 2: Usa categoria (menos específico)
      const categoryTags = productTags.filter((tag) =>
        tag.type === "categoria"
      );

      if (categoryTags.length > 0) {
        tagsToSearch = categoryTags.map((tag) => tag.name).filter((name): name is string => typeof name === "string");
        searchStrategy = "categoria";
      } else {
        // Estratégia 3: Usa todas as tags do produto
        tagsToSearch = productTags.map((tag) => tag.name).filter((name): name is string => typeof name === "string");
        searchStrategy = "all";
      }
    }

    // Se tagType foi especificado, sobrescreve a estratégia
    if (props.tagType) {
      const filteredTags = productTags.filter((tag) =>
        tag.type === props.tagType
      );
      if (filteredTags.length > 0) {
        tagsToSearch = filteredTags.map((tag) => tag.name).filter((name): name is string => typeof name === "string");
        searchStrategy = props.tagType;
      }
    }
  }

  // Se não encontrou tags, retorna null
  if (tagsToSearch.length === 0) return null;

  // 4. Busca produtos com as mesmas tags
  let relatedProducts = await ctx.invoke.vnda.loaders.productList({
    count: props.count + 5, // Pega mais produtos para compensar filtros
    tags: tagsToSearch,
    sort: props.sort,
  });

  // Se não encontrou produtos suficientes e usou subcategoria, tenta com categoria
  if (
    searchStrategy === "subcategoria" &&
    (!relatedProducts || relatedProducts.length < 3)
  ) {
    const categoryTags = productTags.filter((tag) => tag.type === "categoria");
    if (categoryTags.length > 0) {
      relatedProducts = await ctx.invoke.vnda.loaders.productList({
        count: props.count + 5,
        tags: categoryTags.map((tag) => tag.name).filter((
          name,
        ): name is string => typeof name === "string"),
        sort: props.sort,
      });
      searchStrategy = "categoria-fallback";
    }
  }

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
