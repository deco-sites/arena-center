import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Cards {
  src: ImageWidget;
  discount: string;
  href: string;
  width: number;
  height: number;
}

export interface Props {
  images?: Cards[];
}

export default function (props: Props) {
  return (
    <div class="flex flex-row gap-4 text-white">
      {props.images &&
        props.images.map((card) => (
          <a href={card.href}>
            <div class="flex flex-col">
              <Image
                src={card.src}
                width={card.width}
                height={card.height}
              />
              <div class="bg-primary text-center pb-[57px] pt-3">
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
