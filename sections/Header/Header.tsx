import type { ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import User from "../../components/header/User.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SEARCHBAR_DRAWER_ID,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";
import type { AlertItem, ContactItem } from "../../components/header/Alert.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface SectionProps {
  alerts?: AlertItem[];
  /** @maxItems 2 */
  contacts?: ContactItem[];
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[] | null;
  /**
   * @title Searchbar
   * @description Searchbar configuration
   */
  searchbar: SearchbarProps;
  /** @title Logo Mobile*/
  logo: Logo;
  /** @title Logo Desktop*/
  logoDesktop: Logo;
  /**
   * @description Usefull for lazy loading hidden elements, like hamburguer menus etc
   * @hide true */
  loading?: "eager" | "lazy";
}
type Props = Omit<SectionProps, "alert">;
const onLoad = () => {
  const HEIGHT_THRESHOLD = 60;
  let lastScrollY = 0;
  let accumulatedScroll = 0;
  const handleScrollAnimation = () => {
    const header = document.getElementById("header");
    const headerMobile = document.getElementById("header-mobile");
    const scrollPosition = window.scrollY;
    const scrollDifference = scrollPosition - lastScrollY;
    accumulatedScroll += scrollDifference;
    if (Math.abs(accumulatedScroll) >= HEIGHT_THRESHOLD) {
      if (accumulatedScroll > 0) {
        header?.classList.add("opacity-0");
        header?.classList.remove("opacity-100");
        headerMobile?.classList.add("flex");
        headerMobile?.classList.remove("hidden");
      } else {
        header?.classList.remove("opacity-0");
        header?.classList.add("opacity-100");
        headerMobile?.classList.add("hidden");
        headerMobile?.classList.remove("flex");
      }
      accumulatedScroll = 0;
    }
    lastScrollY = scrollPosition;
  };
  globalThis.window.addEventListener("scroll", handleScrollAnimation);
};
const Desktop = ({ navItems, logo, searchbar }: Props) => (
  <>
    <div class="flex flex-col gap-4 pt-5 container max-w-[1440px]">
      <div class="grid grid-cols-3 place-items-center ">
        <div class="place-self-start pl-14">
          <a href="/" aria-label="Store logo">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 200}
              height={logo.height || 23}
            />
          </a>
        </div>

        <Searchbar {...searchbar} />

        <div class="flex gap-4 place-self-end pr-14">
          <User />
          <Bag />
        </div>
      </div>

      <ul class="flex justify-between text-accent-content border-y border-gray-300 h-11 max-w-[1444px] px-14">
        {navItems?.slice(0, 10).map((item) => (
          <NavItem key={item.url} item={item} />
        ))}
      </ul>
    </div>
  </>
);
const SerchBarMobile = ({ searchbar }: Props) => (
  <div
    id="header-mobile"
    class="fixed w-screen mx-auto lg:hidden  justify-center hidden bg-base-100 z-40"
  >
    <Searchbar {...searchbar} />
  </div>
);
const Mobile = ({ logo, searchbar, navItems, loading }: Props) => (
  <>
    <Drawer
      id={SEARCHBAR_DRAWER_ID}
      aside={
        <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID}>
          <div class="w-screen overflow-y-auto ">
            {loading === "lazy"
              ? (
                <div class="h-full w-full flex items-center justify-center">
                  <span class="loading loading-spinner" />
                </div>
              )
              : <Searchbar {...searchbar} />}
          </div>
        </Drawer.Aside>
      }
    />
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
          {loading === "lazy"
            ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <span class="loading loading-spinner" />
              </div>
            )
            : <Menu navItems={navItems ?? []} />}
        </Drawer.Aside>
      }
    />

    <div
      class="grid place-items-center w-screen px-4 gap-3 lg:gap-4"
      style={{
        height: NAVBAR_HEIGHT_MOBILE,
        gridTemplateColumns:
          "min-content auto min-content min-content min-content",
      }}
    >
      <div class="flex ">
        <label
          for={SIDEMENU_DRAWER_ID}
          class="btn btn-square btn-sm btn-ghost"
          aria-label="open menu"
        >
          {/* <Icon id="menu" />  */}

          <img
            src="https://data.decoassets.com/arena-center/42109a6a-97fd-4c1d-94c4-10dbac32f590/pngtree-hamburger-menu-button-list-content-png-image_5288864.png"
            alt=""
          />
        </label>
        <label
          for={SEARCHBAR_DRAWER_ID}
          class="btn btn-square btn-sm btn-ghost "
          aria-label="search icon button"
        >
          {/* <Icon id="search" />  */}
          <Image
            id="search"
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/arena-center/2737a7a2-66a0-45ef-aff9-ae6065f16919/search.svg"
            alt="icone de pesquisa"
            width={20}
            height={20}
          />
        </label>
      </div>
      {logo && (
        <a
          href="/"
          class="flex-grow inline-flex items-center justify-center ml-[-9px]"
          style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
          aria-label="Store logo"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 100}
            height={logo.height || 28}
            class="h-[36px] w-auto mt-[8px] max-md:scale-125"
            fit="contain"
          />
        </a>
      )}

      <div class="flex gap-[6px] items-center mr-[-24px] lg:mr-0">
        <User />
        <Bag />
      </div>
    </div>
  </>
);
function Header({
  alerts = [],
  contacts = [],
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  ...props
}: Props) {
  const device = useDevice();
  return (
    <header
      style={{
        height: device === "desktop"
          ? HEADER_HEIGHT_DESKTOP
          : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class=" fixed w-full z-40  top-0    transition-all duration-500 ease-in-out">
        {alerts.length > 0 && <Alert alerts={alerts} contacts={contacts} />}
        <SerchBarMobile logo={logo} {...props} />
        <div id="header" class="bg-base-100 ">
          {device === "desktop"
            ? <Desktop logo={props.logoDesktop} {...props} />
            : <Mobile logo={logo} {...props} />}
        </div>
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad),
        }}
      />
    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...(props as any)} loading="lazy" />
);
export default Header;
