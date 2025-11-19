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

  /** @description search for products by category */
  category?: string;

  /** @description exclude product from the list */
  excludeProductId?: number;
}

/**
 * @title VNDA Integration
 * @description Product List loader - Same Category
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
  const segments = pathname.split("/").filter(Boolean);

  // Pega o último segmento como slug do produto
  const slug = segments[segments.length - 1];

  if (!slug) return null;

  // Função para extrair ID do slug (mesmo parseSlug do loader original)
  const parseSlug = (slug: string) => {
    const splitted = slug.split("-");
    const maybeId = Number(splitted[splitted.length - 1]);
    return !isNaN(maybeId) ? { id: maybeId } : null;
  };

  const fromSlug = parseSlug(slug);

  if (!fromSlug) return null;

  // 1. Busca o produto atual para pegar sua categoria
  let currentProduct;
  try {
    currentProduct = await api["GET /api/v2/products/:id"]({
      id: fromSlug.id,
      include_images: "false", // Não precisa das imagens aqui
    }, STALE).then((res) => res.json());
  } catch (error) {
    console.error("Erro ao buscar produto atual:", error);
    return null;
  }

  if (!currentProduct) return null;

  // 2. Pega a categoria do produto atual
  // Adapte isso conforme a estrutura da sua API VNDA
  const category = currentProduct.category_tags?.[0];

  if (!category) return null;

  // 3. Busca produtos da mesma categoria
  const searchParams: Record<string, unknown> = {
    term: props?.category || category, // Usa props.category se fornecido, senão usa a categoria do produto
    wildcard: props?.wildcard,
    sort: props?.sort,
    per_page: props?.count,
    "tags[]": props?.tags,
    ...Object.fromEntries(
      (props.typeTags || []).map((
        { key, value },
      ) => [`type_tags[${key}][]`, value]),
    ),
  };

  if (props?.ids && props.ids.length > 0) {
    searchParams["ids[]"] = props.ids;
  }

  const { results: searchResults = [] } = await api
    ["GET /api/v2/products/search"](searchParams, STALE)
    .then((res) => res.json());

  let validProducts = searchResults.filter(({ variants }) => {
    return variants.length !== 0;
  });

  // 4. Exclui o produto atual dos resultados
  validProducts = validProducts.filter(
    (product) => product.id !== fromSlug.id,
  );

  if (validProducts.length === 0) return null;

  const sortedProducts = props.ids && props.ids.length > 0
    ? props.ids.map((id) => validProducts.find((product) => product.id === id))
      .filter(Boolean)
    : validProducts;

  return sortedProducts.map((product) => {
    return toProduct(product!, null, {
      url,
      priceCurrency: "BRL",
    });
  });
};

export default pdpProductList;
