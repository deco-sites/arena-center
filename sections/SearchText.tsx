import { HTMLWidget } from "apps/admin/widgets.ts";

interface Props {
  /**
   * @title Titulo da página
   */
  title?: string;
  /** @title Descrição */
  description?: HTMLWidget;
}

export default function Section({ title, description }: Props) {
  return (
    <div class="max-w-[1440px] mx-auto px-20 my-14">
      <h2 class="text-center text-2xl font-bold text-primary">{title}</h2>
      {description && (
        <div
          class="font-normal text-accent text-[12px] my-4"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
    </div>
  );
}
