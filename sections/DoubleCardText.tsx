export interface InfoSectionProps {
  title: string;
  /**
   * @title Paragrafo
   * @type rich-text
   */
  text: string;
}

export interface Props {
  infoSectionProps: InfoSectionProps[];
}

export default function DoubleCardText({ infoSectionProps }: Props) {
    return(
        <div class="flex flex-col lg:flex-row mx-auto justify-around mt-12 max-w-[1440px]">
            {infoSectionProps.map((item) => (
                <div class="w-full max-w-[360px] flex flex-col items-center gap-4">
                    <p class="text-primary text-2xl text-center items-start">{item.title}</p>
                    <div class="text-xs text-accent-content block max-w-[500px]" dangerouslySetInnerHTML={{ __html: item.text }}/>
                </div>
            ))};
        </div>
  );
}
