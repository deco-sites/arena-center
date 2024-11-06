import { HTMLWidget } from "apps/admin/widgets.ts";

interface Props {
  title: string;
  conteudo: HTMLWidget;
}

export default function Section({ title, conteudo }: Props) {
  return (
    <div class="max-w-[1440px] mx-auto mt-16 ">
      <h2 class="text-2xl text-primary text-center">{title ? title : ""}</h2>
      <div
        class="px-10 mt-12 reset_styles"
        dangerouslySetInnerHTML={{ __html: conteudo ? conteudo : "" }}
      />
    </div>
  );
}
