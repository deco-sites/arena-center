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
    <div class=" py-5 lg:py-12 bg-primary w-full">
      <div class="flex items-center overflow-auto mx-auto w-screen px-4 md:max-w-[1440px] py-3 h-auto">
        {text &&
          text.map((item) => (
            <div class="flex flex-col md:px-8 overflow-auto flex-shrink-0 w-[80%] md:w-1/3 px-8 text-center justify-center text-primary-content">
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

/**flex items-center overflow-auto mx-auto bg-primary  px-4 md:max-w-[1440px] py-3 h-auto */
