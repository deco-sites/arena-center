import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Avatar from "../../components/ui/Avatar.tsx";
import { clx } from "../../sdk/clx.ts";

export interface CategoryFilter {
  title: string;
  links: {
    label: string;
    url: string;
  }[];
}

interface Props {
  filters: ProductListingPage["filters"];
  categoryList?: CategoryFilter;
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem({ url, selected, label, quantity }: FilterToggleValue) {
  const startsWithLetter = /^[a-zA-Z]/.test(label);
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2">
      <div aria-checked={selected} class="checkbox" />
      <span class="text-sm first-letter:uppercase">
        {startsWithLetter ? label.replace("-", " ") : label
          .split("_")
          .map(
            (parte) => `R$${parseFloat(parte).toFixed(2).replace(".", ",")}`,
          )
          .join(" ~ ")}
      </span>
      {quantity > 0 && <span class="text-sm text-base-400">({quantity})</span>}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";

  return (
    <ul class={clx(`flex flex-wrap gap-2 `, flexDirection)}>
      {values.map((item) => {
        const { url, selected, value } = item;

        if (avatars) {
          return (
            <a href={url} rel="nofollow">
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
              />
            </a>
          );
        }

        if (key === "price-range") {
          const range = parseRange(item.value);

          return range && <ValueItem key={item.url} {...item} />;
        }

        return <ValueItem key={item.url} {...item} />;
      })}
    </ul>
  );
}

function Filters({ filters }: Props) {
  return (
    <div class="flex gap-3 ">
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
                    {
                      /* <span class="text-sm font-semibold first-letter:uppercase">
                      {filter.label}
                    </span> */
                    }
                    <FilterValues {...filter} />
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
                    {
                      /* <span class="text-sm font-semibold first-letter:uppercase">
                      {filter.label}
                    </span> */
                    }
                    <FilterValues {...filter} />
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
      <div class="relative">
        <input type="checkbox" id="price-toggle" class="peer hidden" />

        <label
          for="price-toggle"
          class="select w-[193px] h-6 rounded-md border border-secondary  min-h-0 text-[10px] "
        >
          Preço
        </label>

        <div class="absolute top-12 bg-white shadow-lg p-4 rounded-lg transition-all duration-300 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible">
          <ul class="flex flex-col gap-6 p-4 sm:p-0 mt-6">
            {filters.filter(isToggle).map(
              (filter) =>
                filter.label === "filtro-preco" && (
                  <li key={filter.label} class="flex flex-col gap-4">
                    <span class="text-sm font-semibold first-letter:uppercase">
                      {filter.label}
                    </span>
                    <FilterValues {...filter} />
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Filters;
