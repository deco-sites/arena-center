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
      <div class="flex gap-3 px-3 overflow-auto max-w-[1440px] w-full mx-auto pt-8">
        {img.map((item) => (
          <div class="relative">
            <a href={item.link} class="w-[80vw] block lg:w-auto">
              <Image
                src={item.mobile}
                width={321}
                height={307}
                loading={"lazy"}
              />
            </a>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div class="flex gap-2 px-10 overflow-auto lg:overflow-visible max-w-[1440px] w-full mx-auto pt-8">
      <div class="relative lg:overflow-hidden">
        <a href={img[0].link} class="w-[80vw] block lg:w-auto">
          <Image
            class="lg:hover:scale-110 duration-200"
            src={img[0].desktop}
            width={596}
            height={569}
            loading={"lazy"}
          />
        </a>
      </div>
      <div class="flex lg:flex-col gap-2">
        <div class="relative overflow-hidden w-[80vw] lg:w-auto">
          <a href={img[1].link}>
            <Image
              class="lg:hover:scale-110 duration-200"
              src={img[1].desktop}
              width={712}
              height={281}
              loading={"lazy"}
            />
          </a>
        </div>
        <div class="relative overflow-hidden w-[80vw] lg:w-auto">
          <a href={img[2].link}>
            <Image
              class="lg:hover:scale-110  duration-200"
              src={img[2].desktop}
              width={712}
              height={281}
              loading={"lazy"}
            />
          </a>
        </div>
      </div>
    </div>
  );
}