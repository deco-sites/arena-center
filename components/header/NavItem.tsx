import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";
import { clx } from "site/sdk/clx.ts";

function NavItem({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;
  const image = item?.image?.[0];

  return (
    <li
      class={clx(
        "group flex items-center px-4",
        "first:!pr-4 first:!pl-0 last:!pl-4 last:!pr-0",
      )}
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <a
        href={url}
        class="group-hover:underline text-sm font-light hover:text-primary "
      >
        {name}
      </a>

      {children && children.length > 0 && (
        <div
          class={clx(
            "text-xs bg-white z-40 max-h-[70vh] !overflow-auto custom-scroll mx-auto",
            "items-start justify-center gap-5  max-w-[1440px] w-full",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "pointer-events-none group-hover:pointer-events-auto",
            "fixed left-1/2 -translate-x-1/2",
          )}
          style={{
            top: HEADER_HEIGHT_DESKTOP,
          }}
        >
          {image?.url && (
            <Image
              class="p-6"
              src={image.url}
              alt={image.alternateName}
              width={300}
              height={332}
              loading="lazy"
            />
          )}
          <ul class="flex items-start justify-start gap-6 px-14 py-4 w-full">
            {children.map((node) => (
              <li>
                <a
                  class="hover:underline  text-center "
                  href={node.url}
                >
                  <span class=" font-medium text-sm text-secondary text-center">
                    {node.name}
                  </span>
                </a>

                <ul class="flex flex-col gap-2 mt-4 min-w-[150px]">
                  {node.children?.map((leaf) => (
                    <li>
                      <a class="hover:underline " href={leaf.url}>
                        <span class="text-xs  text-center">
                          {leaf.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default NavItem;
