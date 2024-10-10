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
}

export interface Props {
  mainTitle?: string;
  learnMore: LearnMore[];
}

export default function LearnMore({ mainTitle, learnMore }: Props) {
  return (
    <div class="flex flex-col gap-4 items-center mt-8 text-neutral mx-auto max-w-[1440px]">
      <p class="font-light text-2xl text-center text-primary md:text-base-content">{mainTitle}</p>
      <div class="flex flex-col md:flex-row md::flex-row gap-8 md:gap-2">
        {learnMore.map((learnMore) => (
          <div class="flex flex-col gap-2 px-4 md:px-0 items-center text-center">
            <Image
            class="w-full"
              src={learnMore.image}
              width={395}
              height={184}
              alt={learnMore.title}
              loading={"lazy"}
            />
            <p class="pt-4 text-lg">
              {learnMore.title}
            </p>
            <p class="px-4 pt-2 pb-3 text-[12px]">{learnMore.paragraph}</p>
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
