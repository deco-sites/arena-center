import { HTMLWidget } from "apps/admin/widgets.ts";

export interface Text {
  /**
   * @title Titulo Principal
   */
  mainTitle?: string;
  /**
   * @title Main Title
   * @format rich-text
   */
  paragraph: string;
}

interface Props {
  text: Text[];
}

export default function CenteredText({ text }: Props) {
  return (
    <div class="py-12 bg-primary w-full">
      <div class="container gap-8 flex justify-center shrink-0 overflow-auto mx-auto max-w-[1440px]">
        {text &&
          text.map((item) => (
            <div class="flex flex-col w-[90%] md:w-1/4 md:px-8 overflow-auto text-center justify-center text-primary-content">
              <p class="text-lg font-bold">{item.mainTitle}</p>
              <div
                class="font-light"
                dangerouslySetInnerHTML={{ __html: item.paragraph }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
