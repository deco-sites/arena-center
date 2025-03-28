import type { SiteNavigationElement } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";
import { useId } from "site/sdk/useId.ts";

export interface Props {
  navItems?: SiteNavigationElement[];
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  function toogleOpen(id: string) {
    const collapse = document.getElementById(id) as HTMLDivElement;
    collapse.classList.toggle("collapse-open");
  }
  const id = useId();
  return (
    <div class="collapse collapse-plus" id={id}>
      <input
        hx-on:change={useScript(toogleOpen, id)}
        type="checkbox"
        class="w-12 ml-auto"
      />
      <a class="collapse-title capitalize text-left" href={item.url}>
        {item.name}
      </a>
      <div class="collapse-content">
        <ul>
          {item.children?.map((node) => {
            const childrenId = useId();
            return (
              <li>
                <div class="collapse collapse-plus" id={childrenId}>
                  <input
                    hx-on:change={useScript(toogleOpen, childrenId)}
                    type="checkbox"
                    class="w-12 ml-auto"
                  />
                  <a
                    class="collapse-title capitalize font-medium"
                    href={node.url}
                  >
                    {node.name}
                  </a>
                  <div class="collapse-content">
                    <ul>
                      {item.children?.map((nodeItem) => (
                        <li class="mt-4">
                          <a href={nodeItem.url}>{nodeItem.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div
      class="flex flex-col h-full bg-base-100 "
      style={{ minWidth: "100vw" }}
    >
      <ul class="px-4 flex-grow flex flex-col divide-y divide-base-200  text-accent-content ">
        {navItems.map((item) => (
          <li>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
