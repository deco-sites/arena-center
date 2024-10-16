import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";
import Newsletter from "../Newsletter/Newsletter.tsx";
import { Props as NewsletterProps } from "../Newsletter/Newsletter.tsx";

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
export interface SocialItem {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

/** @titleBy alt */
interface Social {
  socialTitle: string;
  socialItems: SocialItem[];
}

/** @titleBy alt */
export interface Methods {
  /**@title icone da bandeira */
  img: ImageWidget;
  alt: string;
}
/** @titleBy paymentTitle */
export interface PaymentMethod {
  /**@title Titulo da forma de pagamento */
  paymentTitle: string;
  payment: Methods[];
}

interface Apps {
  icon: ImageWidget;
  link: string;
}
interface Logos {
  img: ImageWidget;
  href: string;
  alt: string;
}
interface Props {
  aboutUs: AboutUs;
  links?: Link[];
  social?: Social;
  apps: Apps[];
  paymentMethods: PaymentMethod[];
  policies?: Item[];
  logo: Logos[];
  trademark?: string;
  newsletterProps: NewsletterProps;
}

function Footer({
  links = [],
  social,
  policies = [],
  paymentMethods = [],
  logo,
  trademark,
  aboutUs,
  apps,
  newsletterProps,
}: Props) {
  return (
    <footer class="px-5 sm:px-0 mt-10 w-full sm:mt-11 bg-primary text-primary-content">
      <div class="flex flex-col max-w-[1440px] mx-auto gap-5 py-10">
      <Newsletter {...newsletterProps} />
        <ul class="grid grid-flow-row lg:grid-flow-col w-full justify-around mx-auto columns-2 gap-6 px-4">
          <li class="flex flex-col gap-4 col-start-1 col-end-3 w-full md:w-[180px]">
            <p class="text-xs font-medium">{aboutUs.title}</p>
            <p class="text-[10px]">{aboutUs.paragraph}</p>
          </li>
          {links.map(({ title, href, children }) => (
            <li class="flex flex-col gap-4 max-w-[205px]">
              <a class="text-xs font-medium" href={href}>{title}</a>
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
                      class={`text-[10px] ${
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
          <div class="flex flex-col gap-4">
            <p class="text-xs font-medium">{social?.socialTitle}</p>
            <div class="flex md:justify-center lg:justify-around">
              {social?.socialItems.map(({ image, href, alt }) => (
                <div class="">
                  <a href={href}>
                    <Image
                      src={image}
                      alt={alt}
                      loading="lazy"
                      width={22}
                      height={22}
                    />
                  </a>
                </div>
              ))}
            </div>
            <div class="flex justify-between">
              {apps.map((itens) => (
                <a href={itens.link}>
                  <Image
                    src={itens.icon}
                    width={63}
                    height={18}
                    alt={itens.link}
                  />
                </a>
              ))}
            </div>
            {paymentMethods.map((test) => (
              <div class="flex gap-1 flex-wrap w-[165px]  justify-center items-center">
                <p class="text-xs w-full font-bold text-center">
                  {test.paymentTitle}
                </p>
                {test.payment.map(({ img, alt }) => (
                  <li>
                    <div class="bg-white flex-row flex justify-center p-1 items-center w-8 h-5">
                      <Image
                        class="object-contain w-full h-full bg-white"
                        src={img}
                        alt={alt}
                        fit="contain"
                        width={26}
                        height={16}
                        loading="lazy"
                      />
                    </div>
                  </li>
                ))}
              </div>
            ))}
          </div>
        </ul>
        <div class="flex flex-col sm:flex-row gap-12 justify-between items-start sm:items-center">
          <ul class="flex gap-4">
          </ul>
          <ul class="flex flex-wrap gap-2">
          </ul>
        </div>
        <div class="w-full gap-8">
          <ul class="flex flex-col gap-8 text-center justify-center items-center">
            {policies.map(({ title, href }) => (
              <li class="w-full">
                <a class="text-[10px] font-medium" href={href}>
                  {title}
                </a>
              </li>
            ))}
            <div class="flex flex-col flex-nowrap items-center justify-between sm:justify-center gap-4">
             
              <div class="flex items-center justify-center gap-4">
                {logo.map((item)=>(
                  <a href={item.href} target="_blank">
                    <Image
                    class="object-contain"
                    src={item.img}
                    width={57}
                    height={24}
                    loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          </ul>
        </div>
      </div>
      <div class="mx-12 pb-4"> <span class="text-xs font-normal text-base-400">{trademark}</span></div>
    </footer>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
