import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";

function NavItem({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;
  const image = item?.image?.[0];

  return (
    <li
      class="group flex items-center "
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
          class="fixed hidden hover:flex text-xs group-hover:flex bg-white z-40 items-start justify-center gap-6  max-w-[1440px] !overflow-auto custom-scroll  mx-auto top-[-15px] capitalize w-full left-1/2 -translate-x-1/2"
          style={{
            marginTop: HEADER_HEIGHT_DESKTOP,
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
          <ul class="flex items-start justify-start gap-6 container">
            {children.map((node) => (
              <li class="p-6">
                <a class="hover:underline capitalize" href={node.url}>
                  <span class="capitalize font-medium">{node.name}</span>
                </a>

                <ul class="flex flex-col gap-2 mt-4">
                  {node.children?.map((leaf) => (
                    <li>
                      <a class="hover:underline capitalize" href={leaf.url}>
                        <span class="text-xs capitalize">{leaf.name}</span>
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
