// deno-lint-ignore-file no-explicit-any
import { STALE } from "apps/utils/fetch.ts";
import { Product } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/deco/vnda.ts";
import { toProduct } from "apps/vnda/utils/transform.ts";

export interface Props {
  /** @description total number of items to display */
  count: number;

  /** @description query to use on search */
  term?: string;

  /** @description search for term anywhere */
  wildcard?: boolean;

  /** @description search sort parameter */
  sort?: "newest" | "oldest" | "lowest_price" | "highest_price";

  /** @description search for products that have certain tag */
  tags?: string[];

  /** @description search for products that have certain type_tag */
  typeTags?: { key: string; value: string }[];

  /** @description search for products by id */
  ids?: number[];

  /** @description Override to use specific tags instead of product tags */
  useSpecificTags?: boolean;
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
  const { api } = ctx;

  // Extrai o slug da URL atual para buscar o produto
  const pathname = url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  
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

  // 1. Busca o produto atual para pegar suas tags/categorias
  let currentProduct;
  try {
    currentProduct = await api["GET /api/v2/products/:id"]({
      id: fromSlug.id,
      include_images: "false",
    }, STALE).then(res => res.json());
  } catch (error) {
    console.error("Erro ao buscar produto atual:", error);
    return null;
  }

  if (!currentProduct) return null;

  // 2. Define quais tags usar para busca
  let tagsToSearch: string[] = [];

  if (props.useSpecificTags && props.tags && props.tags.length > 0) {
    // Usa tags específicas passadas via props
    tagsToSearch = props.tags;
  } else {
    // Tenta pegar tags do produto
    // Prioridade: category_tags -> tag_names
    if (currentProduct.category_tags && currentProduct.category_tags.length > 0) {
      tagsToSearch = currentProduct.category_tags
        .map((tag: any) => tag.name)
        .filter((name: string | undefined): name is string => Boolean(name));
    } else if (currentProduct.tag_names && currentProduct.tag_names.length > 0) {
      tagsToSearch = currentProduct.tag_names;
    }
  }

  // Se não encontrou tags, retorna null
  if (tagsToSearch.length === 0) return null;

  // 3. Monta os parâmetros de busca seguindo o padrão do searchLoader
  const searchParams: Record<string, any> = {
    per_page: props.count,
    sort: props.sort,
    wildcard: props.wildcard ?? true,
    show_only_available: true,
  };

  // Adiciona as tags no formato correto
  searchParams["tags[]"] = tagsToSearch;

  // Se term foi fornecido, usa ele
  if (props.term) {
    searchParams.term = props.term;
  }

  // Adiciona type_tags se fornecido
  if (props.typeTags && props.typeTags.length > 0) {
    props.typeTags.forEach(({ key, value }) => {
      const paramKey = `type_tags[${key}][]`;
      if (!searchParams[paramKey]) {
        searchParams[paramKey] = [];
      }
      searchParams[paramKey].push(value);
    });
  }

  // Adiciona IDs específicos se fornecido
  if (props.ids && props.ids.length > 0) {
    searchParams["ids[]"] = props.ids;
  }

  // 4. Executa a busca
  const { results: searchResults = [] } = await api
    ["GET /api/v2/products/search"](searchParams, STALE)
    .then((res) => res.json())
    .catch(() => ({ results: [] }));

  // 5. Filtra produtos válidos (com variantes)
  let validProducts = searchResults.filter(({ variants }: any) => {
    return variants && variants.length !== 0;
  });

  // 6. Remove o produto atual dos resultados
  validProducts = validProducts.filter(
    (product: any) => product.id !== fromSlug.id
  );

  if (validProducts.length === 0) return null;

  // 7. Ordena se IDs foram fornecidos
  const sortedProducts = props.ids && props.ids.length > 0
    ? props.ids
        .map((id) => validProducts.find((product: any) => product.id === id))
        .filter(Boolean)
    : validProducts;

  // 8. Converte para o formato Product
  return sortedProducts.map((product: any) => {
    return toProduct(product, null, {
      url,
      priceCurrency: "BRL",
    });
  });
};

export default pdpProductList;