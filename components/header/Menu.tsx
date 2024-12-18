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
                        <a href={nodeItem.url} >
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
    <div
      class="flex flex-col h-full overflow-y-auto"
      style={{ minWidth: "100vw" }}
    >
      <ul class="px-4 flex-grow flex flex-col divide-y divide-base-200 overflow-y-auto text-accent-content">
        {navItems.map((item) => (
          <li>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>

      {/* <ul class="flex flex-col py-2 bg-base-200">
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="/wishlist"
          >
            <Icon id="favorite" />
            <span class="text-sm">Lista de desejos</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="home_pin" />
            <span class="text-sm">Nossas lojas</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="call" />
            <span class="text-sm">Fale conosco</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="account_circle" />
            <span class="text-sm">Minha conta</span>
          </a>
        </li>
      </ul> */}
    </div>
  );
}

export default Menu;
