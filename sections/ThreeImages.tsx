import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import { useDevice } from "@deco/deco/hooks";
export interface Image {
  desktop: ImageWidget;
  mobile: ImageWidget;
  link?: string;
}

export interface Props {
  /**
   * @maximum 3
   */
  img: Image[];
}

export default function ({ img }: Props) {
  const device = useDevice();
  if (device !== "desktop") {
    return (
      <div class="flex gap-3 pl-6 overflow-auto max-w-[1440px] w-full mx-auto mt-7 custom-container">
        {img.map((item) => (
          <div class="relative">
            <a href={item.link} class="w-[80vw] block lg:w-auto">
              <Image
                src={item.mobile}
                width={321}
                height={307}
                loading="lazy"
              />
            </a>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div class="flex gap-2 px-6 overflow-auto lg:overflow-visible max-w-[1440px] w-full mx-auto mt-8">
      <div class="relative lg:overflow-hidden">
        <a href={img[0].link} class=" block">
          <Image
            class="lg:hover:scale-110 duration-200 w-full"
            src={img[0].desktop}
            width={596}
            height={578}
            loading="lazy"
          />
        </a>
      </div>
      <div class="flex lg:flex-col gap-2">
        <div class="relative overflow-hidden">
          <a href={img[1].link}>
            <Image
              class="lg:hover:scale-110 duration-200 w-full"
              src={img[1].desktop}
              width={596}
              height={285}
              loading="lazy"
            />
          </a>
        </div>
        <div class="relative overflow-hidden">
          <a href={img[2].link}>
            <Image
              class="lg:hover:scale-110  duration-200 w-full"
              src={img[2].desktop}
              width={596}
              height={285}
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
