import Icon from "../../components/ui/Icon.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

export interface Props {
  navItems?: SiteNavigationElement[];
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  return (
    <div class="collapse collapse-plus">
      <input type="checkbox" />
      <a class="collapse-title capitalize" href={item.url}>
        {item.name}
      </a>
      <div class="collapse-content">
        <ul>
          {item.children?.map((node) => (
            <li>
              <div class="collapse collapse-plus">
                <input type="checkbox" />
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
                        <a href={nodeItem.url}>
                          {nodeItem.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div class="flex flex-col h-full bg-base-100 " style={{ minWidth: "100vw" }}>
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
