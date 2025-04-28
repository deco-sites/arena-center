import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { useScript } from "@deco/deco/hooks";
import { useId } from "site/sdk/useId.ts";
import { getFiltersByUrl, updateQueryParam } from "site/sdk/processFilters.ts";

export interface CategoryFilter {
  title: string;
  links: {
    label: string;
    url: string;
  }[];
}

interface Props {
  filters: ProductListingPage["filters"];
  url: string;
  categoryList?: CategoryFilter;
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { url, selected, label, quantity, filterLabel, windowUrl }:
    & FilterToggleValue
    & {
      windowUrl: string;
      filterLabel: string;
    },
) {
  const startsWithLetter = /^[a-zA-Z]/.test(label);
  const value = getFiltersByUrl(url, windowUrl);

  const id = useId();
  return (
    <button
      type="button"
      hx-on:click={useScript(updateQueryParam, {
        label: filterLabel,
        value,
        id,
      })}
      href={url}
      rel="nofollow"
      class="flex items-center gap-2"
    >
      <div id={id} aria-checked={selected} class="checkbox" />
      <span class="text-sm first-letter:uppercase">
        {startsWithLetter ? label.replace("-", " ") : label
          .split("_")
          .map(
            (parte) => `R$${parseFloat(parte).toFixed(2).replace(".", ",")}`,
          )
          .join(" ~ ")}
      </span>
      {quantity > 0 && <span class="text-sm text-base-400">({quantity})</span>}
    </button>
  );
}

function FilterValues(
  { key, values, label, windowUrl }: FilterToggle & { windowUrl: string },
) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";

  return (
    <ul class={clx(`flex flex-wrap gap-2 `, flexDirection)}>
      {values.map((item) => {
        return (
          <ValueItem
            filterLabel={label}
            windowUrl={windowUrl}
            key={item.url}
            {...item}
          />
        );
      })}
    </ul>
  );
}

function Filters({ filters, url }: Props) {
  return (
    <div class="flex items-center gap-3 ">
      <div class="relative">
        <input type="checkbox" id="category-toggle" class="peer hidden" />

        <label
          for="category-toggle"
          class="select w-[193px] h-6 rounded-md border border-secondary  min-h-0 text-[10px] "
        >
          Categoria
        </label>

        <div class="absolute top-12 bg-white shadow-lg p-4 rounded-lg transition-all duration-300 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible">
          <ul class="flex flex-col gap-6 p-4 sm:p-0 mt-6">
            {filters.filter(isToggle).map(
              (filter) =>
                filter.label === "subcategoria-mae" && (
                  <li key={filter.label} class="flex flex-col gap-4">
                    <FilterValues windowUrl={url} {...filter} />
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
      <div class="relative">
        <input type="checkbox" id="subcategory-toggle" class="peer hidden" />

        <label
          for="subcategory-toggle"
          class="select w-[193px] h-6 rounded-md border border-secondary  min-h-0 text-[10px] "
        >
          Subcategoria
        </label>

        <div class="absolute top-12 bg-white shadow-lg p-4 rounded-lg transition-all duration-300 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible">
          <ul class="flex flex-col gap-6 p-4 sm:p-0 mt-6">
            {filters.filter(isToggle).map(
              (filter) =>
                filter.label === "subcategoria" && (
                  <li key={filter.label} class="flex flex-col gap-4">
                    <FilterValues windowUrl={url} {...filter} />
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
      <div>
        <button
          type="button"
          hx-on:click={useScript(() => {
            function getFilteredUrl(): string {
              const SESSION_URL_KEY = "filteredUrl";
              let url = sessionStorage.getItem(SESSION_URL_KEY);
              if (!url) {
                sessionStorage.setItem(
                  SESSION_URL_KEY,
                  globalThis.window.location.href,
                );
                url = globalThis.window.location.href;
              }
              return url;
            }

            globalThis.window.location.href = getFilteredUrl();
          })}
          class="bg-black text-white rounded-lg py-1 px-2 text-[12px]"
        >
          APLICAR FILTRO
        </button>
      </div>
    </div>
  );
}

export default Filters;
