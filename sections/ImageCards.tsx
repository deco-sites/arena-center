import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Cards {
  src: ImageWidget;
  discount: string;
  href: string;
}

export interface Props {
  images?: Cards[];
}

export default function (props: Props) {
  return (
    <div class="flex flex-row gap-10 md:gap-4 text-white max-w-[1440px] overflow-auto lg:overflow-visible mt-16 lg:mt-6 mx-auto px-6 md:justify-center">
      {props.images &&
        props.images.map((card) => (
          <a href={card.href}>
            <div class="flex flex-col">
              <Image
                class="hidden lg:block w-full"
                src={card.src}
                width={294}
                height={368}
              />
              <div class="bg-primary text-center lg:pb-[57px] lg:w-auto overflow-auto lg:overflow-visible rounded-full lg:rounded-none py-10 lg:pt-3 px-16">
                <p class="font-extralight text-2xl">até</p>
                <p class="text-[73px] font-bold">{card.discount}</p>
                <p class="text-5xl">OFF</p>
              </div>
            </div>
          </a>
        ))}
    </div>
  );
}
