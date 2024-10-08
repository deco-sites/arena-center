import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

/**
 * @title {{title}}
 */
export interface LearnMore {
  image: ImageWidget;
  title: string;
  paragraph: string;
  cta: string;
  link: string;
  width: number;
  height: number;
}

export interface Props {
  mainTitle?: string;
  learnMore: LearnMore[];
}

export default function ({ mainTitle, learnMore }: Props) {
  return (
    <div class="flex flex-col items-center pt-8 text-neutral">
      <p class="pb-4 font-light text-2xl text-center">{mainTitle}</p>
      <div class="flex gap-2">
        {learnMore.map((learnMore) => (
          <div class="flex flex-col items-center text-center">
            <Image
              class="w-full"
              src={learnMore.image}
              width={learnMore.width}
              height={learnMore.height}
              alt={learnMore.title}
              loading={"lazy"}
            />
            <p class="pt-4">{learnMore.title}</p>
            <p class="px-4 pt-2 pb-3 text-[10px]">{learnMore.paragraph}</p>
            <a
              href={learnMore.link}
              class="border-neutral px-[67px] py-2 border rounded-lg font-semibold text-xs"
            >
              {learnMore.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
