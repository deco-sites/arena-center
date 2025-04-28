import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { getFiltersByUrl, updateQueryParam } from "site/sdk/processFilters.ts";
import { useId } from "site/sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";

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
  { url, selected, label, quantity, windowUrl, filterLabel }:
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
  { key, values, windowUrl, label }: FilterToggle & { windowUrl: string },
) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";

  return (
    <ul class={clx(`flex flex-wrap gap-2 `, flexDirection)}>
      {values.map((item) => {
        return (
          <ValueItem
            key={item.url}
            filterLabel={label}
            windowUrl={windowUrl}
            {...item}
          />
        );
      })}
    </ul>
  );
}

function FiltersMobile({ filters, categoryList, url }: Props) {
  return (
    <div>
      <span class="text-sm font-semibold first-letter:uppercase mt-3">
        {categoryList?.title}
      </span>
      {categoryList && (
        <ul class="flex flex-col mt-5 p-4 sm:p-0 gap-4">
          {categoryList.links.map((item) => (
            <li class="text-sm">
              <a href={item.url}>{item.label}</a>
            </li>
          ))}
        </ul>
      )}
      <ul class="flex flex-col gap-6 p-4 sm:p-0 mt-6">
        {filters.filter(isToggle).map(
          (filter) =>
            filter.label === "subcategoria-mae" && (
              <li class="flex flex-col gap-4">
                <span class="text-sm font-semibold first-letter:uppercase">
                  Categoria
                </span>
                <FilterValues windowUrl={url} {...filter} />
              </li>
            ),
        )}
      </ul>
      <ul class="flex flex-col gap-6 p-4 sm:p-0 mt-6">
        {filters.filter(isToggle).map(
          (filter) =>
            filter.label === "subcategoria" && (
              <li class="flex flex-col gap-4">
                <span class="text-sm font-semibold first-letter:uppercase">
                  {filter.label}
                </span>
                <FilterValues windowUrl={url} {...filter} />
              </li>
            ),
        )}
      </ul>
    </div>
  );
}

export default FiltersMobile;
