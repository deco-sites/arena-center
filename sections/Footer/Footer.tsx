import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";
import Newsletter from "../Newsletter/Newsletter.tsx";

/** @titleBy title */
interface Item {
  title: string;
  href?: string;
  icon?: ImageWidget;
  bold?: boolean;
}

/** @titleBy title */
interface Link extends Item {
  children: Item[];
}
/**@title title */
interface AboutUs {
  title?: string;
  /**
   * @format text-area
   */
  paragraph: string;
}

/** @titleBy alt */
interface Social {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

interface Apps {
  icon: ImageWidget;
  link: string;
}
interface Props {
  aboutUs: AboutUs;
  links?: Link[];
  socialTitle: string;
  social?: Social[];
  apps: Apps[];
  paymentMethods?: Social[];
  policies?: Item[];
  logo?: ImageWidget;
  trademark?: string;
}

function Footer({
  links = [],
  social = [],
  policies = [],
  paymentMethods = [],
  logo,
  trademark,
  aboutUs,
  socialTitle,
  apps,
}: Props) {
  return (
    <footer class="px-5 sm:px-0 mt-10 sm:mt-11 bg-primary text-primary-content">
      <div class="container flex flex-col gap-5 sm:gap-10 py-10">
        <ul class="grid grid-flow-row sm:grid-flow-col gap-6 ">
          <div class="flex flex-col gap-4">
            <p class="text-base font-medium">{aboutUs.title}</p>
            <p>{aboutUs.paragraph}</p>
          </div>
          {links.map(({ title, href, children }) => (
            <li class="flex flex-col gap-4">
              <a class="text-base font-medium" href={href}>{title}</a>
              <ul class="flex flex-col gap-2">
                {children.map(({ title, href, icon, bold }) => (
                  <li class="flex gap-1">
                    {icon &&
                      (
                        <Image
                          src={icon}
                          width={22}
                          height={22}
                        />
                      )}
                    <a
                      class={`text-xs ${
                        bold ? "font-medium" : "font-normal"
                      }`}
                      href={href}
                    >
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
            
          <div class="flex flex-col w-32">
              <p class="text-base font-semibold">{socialTitle}</p>
              <div class="flex">
                {social.map(({ image, href, alt }) => (
                  <div class="w-12">
                    <a href={href}>
                      <Image
                        src={image}
                        alt={alt}
                        loading="lazy"
                        width={32}
                        height={32}
                      />
                    </a>
                  </div>
                ))}
              </div>
            {apps.map((itens) => (
                <a href={itens.link}>
                  <Image
                  src={itens.icon}
                  width={65}
                  height={20}
                  alt={itens.link}
                  />
                </a>
            ))}
          </div>
        </ul>

        <div class="flex flex-col sm:flex-row gap-12 justify-between items-start sm:items-center">
          <ul class="flex gap-4">
          </ul>
          <ul class="flex flex-wrap gap-2">
            {paymentMethods.map(({ image, alt }) => (
              <li class="h-8 w-10 border border-base-100 rounded flex justify-center items-center">
                <Image
                  src={image}
                  alt={alt}
                  width={20}
                  height={20}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>

        <hr class="w-full text-base-400" />

        <div class="grid grid-flow-row sm:grid-flow-col gap-8">
          <ul class="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
            {policies.map(({ title, href }) => (
              <li>
                <a class="text-[10px] font-medium" href={href}>
                  {title}
                </a>
              </li>
            ))}
          </ul>

          <div class="flex flex-nowrap items-center justify-between sm:justify-center gap-4">
            <div>
              <img loading="lazy" src={logo} />
            </div>
            <span class="text-xs font-normal text-base-400">{trademark}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
