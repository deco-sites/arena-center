import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCardSearch from "../../components/product/ProductCardSearch.tsx";
import Filters from "../../components/search/Filters.tsx";
import FiltersMobile from "../../components/search/FiltersMobile.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Drawer from "../ui/Drawer.tsx";
import Sort from "./Sort.tsx";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import { type SectionProps } from "@deco/deco";

export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  //pagination?: "show-more" | "pagination";
  pagination?: "pagination";
}

export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;
  layout?: Layout;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  /** @hidden partial */
  partial?: "hideMore" | "hideLess";
  /**@maximum 3 */
}

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
  );
}

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};

function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const infinite = layout?.pagination !== "pagination";

  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center w-full">
      <div
        class={clx(
          "pb-2 sm:pb-10",
          (!prevPageUrl || partial === "hideLess") && "hidden"
        )}
      >
        <a
          rel="prev"
          class="btn btn-ghost"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          {/* <span class="inline [.htmx-request_&]:hidden">Show Less</span> */}
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>
      <div
        data-product-list
        class={clx(
          "group-has-[#grid-2:checked]/items:grid-cols-2",
          "group-has-[#grid-3:checked]/items:grid-cols-3",
          "group-has-[#grid-4:checked]/items:grid-cols-4",
          "grid items-center",
          "gap-2",
          "sm:gap-10",
          "w-full",
          "productsParentDiv"
        )}
      >
        {products?.map((product, index) => (
          <ProductCardSearch
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full  w-full"
          />
        ))}
      </div>

      <div class={clx("pt-2 sm:pt-10 w-full", "")}>
        {/* {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "btn btn-ghost",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">
                  Mostrar mais
                </span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </a>
            </div>
          )
          : (
            <div class={clx("join", infinite && "hidden", "flex justify-center")}>
              <a
                rel="prev"
                aria-label="previous page link"
                href={prevPageUrl ?? "#"}
                disabled={!prevPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" class="rotate-180" />
              </a>
              <span class="btn btn-ghost join-item">
                Page {zeroIndexedOffsetPage + 1}/
                {Math.ceil(
                  (page.pageInfo.records ?? 0) /
                    (page.pageInfo.recordPerPage ?? products.length),
                )}
              </span>
              <a
                rel="next"
                aria-label="next page link"
                href={nextPageUrl ?? "#"}
                disabled={!nextPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" />
              </a>
            </div>
          )} */}
        <div class={clx("join",  "flex justify-center")}>
          <a
            rel="prev"
            aria-label="previous page link"
            href={prevPageUrl ?? "#"}
            disabled={!prevPageUrl}
            class="btn btn-ghost join-item"
          >
            <Icon id="chevron-right" class="rotate-180" />
          </a>
          <span class="btn btn-ghost join-item">
            Page {zeroIndexedOffsetPage + 1}/
            {Math.ceil(
              (page.pageInfo.records ?? 0) /
                (page.pageInfo.recordPerPage ?? products.length)
            )}
          </span>
          <a
            rel="next"
            aria-label="next page link"
            href={nextPageUrl ?? "#"}
            disabled={!nextPageUrl}
            class="btn btn-ghost join-item"
          >
            <Icon id="chevron-right" />
          </a>
        </div>
      </div>
    </div>
  );
}

const setPageQuerystring = (page: string, id: string) => {
  const element = document
    .getElementById(id)
    ?.querySelector("[data-product-list]");
  if (!element) {
    return;
  }
  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");
    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }
    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};

function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const { startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;

  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        // TODO: get category name from search or cms setting
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: page.products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...useOffer(product.offers),
            index: offset + index,
            product,
            breadcrumbList: page.breadcrumb,
          })
        ),
      },
    },
  });
  const results = (
    <span class="text-sm font-normal">
      Exibindo {page.pageInfo.recordPerPage} de {page.pageInfo.records} itens
    </span>
  );
  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );

  return (
    <>
      <div
        id={container}
        {...viewItemListEvent}
        class="max-w-[1440px] mx-auto "
      >
        {partial ? (
          <PageResult {...props} />
        ) : (
          <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 sm:px-0 max-w-[1440px]">
            <Breadcrumb itemListElement={breadcrumb?.itemListElement} />

            {device === "mobile" && (
              <Drawer
                id={controls}
                aside={
                  <div class="bg-base-100 flex flex-col h-full divide-y overflow-y-hidden">
                    <div class="flex justify-between items-center">
                      <label class="btn btn-ghost" for={controls}>
                        <Icon id="close" />
                      </label>
                    </div>
                    <div class="flex-grow overflow-auto">
                      <FiltersMobile filters={filters} />
                    </div>
                  </div>
                }
              >
                <div class="flex sm:hidden justify-between items-center">
                  <label class="btn btn-ghost" for={controls}>
                    Filters
                  </label>
                  <div class="flex flex-col">{sortBy}</div>
                </div>
              </Drawer>
            )}
            <div class="group/items ">
              {device === "desktop" && (
                <div class="flex flex-col lg:flex-row justify-between gap-3 mt-5">
                  <div class="z-30">
                    <Filters filters={filters} />
                  </div>
                  <div class="flex items-center gap-9 ">
                    <div>{sortBy}</div>
                    <div class="flex w-28 justify-between ">
                      <div>
                        <input
                          type="radio"
                          id="grid-2"
                          name="grid"
                          class="peer hidden"
                        />
                        <label
                          for="grid-2"
                          class="flex cursor-pointer text-gray-400 items-center justify-center peer-checked:text-primary"
                        >
                          <Icon id="grid2" width={16} height={16} />
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="grid-3"
                          name="grid"
                          class="peer hidden"
                        />
                        <label
                          for="grid-3"
                          class="flex text-gray-400 cursor-pointer items-center justify-center peer-checked:text-primary"
                        >
                          <Icon id="grid3" width={25} height={16} />
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="grid-4"
                          name="grid"
                          checked
                          class="peer hidden"
                        />
                        <label
                          for="grid-4"
                          class="flex cursor-pointer items-center justify-center text-gray-400 peer-checked:text-primary"
                        >
                          <Icon id="grid4" width={34} height={15} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div class="mt-4">
                <div class="flex justify-end mb-4">{results}</div>

                <PageResult {...props} />
              </div>
            </div>
          </div>
        )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container
          ),
        }}
      />
    </>
  );
}

function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
  if (!page) {
    return <NotFound />;
  }
  return <Result {...props} page={page} />;
}

export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};

export default SearchResult;
