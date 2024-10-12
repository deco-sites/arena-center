import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useScript } from "deco/hooks/useScript.ts";
import { useId } from "../../sdk/useId.ts";

export interface Button {
  icone: ImageWidget;
}

export interface Props {
  img: ImageWidget;
  /**@maximum 3 */
  buttons: Button[];
}

const gradeButtonsClick = (itemsPerLine: 2 | 3 | 4, id: string) => {
  let largura: string;
  if (itemsPerLine === 2) largura = "50%";
  if (itemsPerLine === 3) largura = "33%";
  if (itemsPerLine === 4) largura = "25%";
  const parentDiv = document.getElementById(id) as HTMLElement;
  const childrenDivs = parentDiv.children as HTMLCollection;
  Array.from(childrenDivs).forEach((item) =>
    (item as HTMLElement).style.width = largura
  );
};

/* TA HARDCODE SÓ PRA TESTES, DEPOIS É PRECISO AJUSTAR*/

export default function ProductListButtons(props: Props) {
  const id = useId();
  return (
    <div>
      <div class="flex justify-end">
        <button class="p-8" hx-on:click={useScript(gradeButtonsClick, 2, id)}>
          <Image
            src={props.buttons[0].icone}
            width={15}
            height={15}
          />
        </button>
        <button class="p-8" hx-on:click={useScript(gradeButtonsClick, 3, id)}>
          <Image
            src={props.buttons[1].icone}
            width={15}
            height={15}
          />
        </button>
        <button class="p-8" hx-on:click={useScript(gradeButtonsClick, 4, id)}>
          <Image
            src={props.buttons[2].icone}
            width={15}
            height={15}
          />
        </button>
      </div>
    </div>
  );
}
