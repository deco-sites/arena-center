import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
export interface Props {
}
const gradeButtonsClick = (itemsPerLine: 2 | 3 | 4, id: string) => {
  let cols: string;
  if (itemsPerLine === 2) {
    cols = "2";
  }
  if (itemsPerLine === 3) {
    cols = "3";
  }
  if (itemsPerLine === 4) {
    cols = "4";
  }
  const parentDiv = document.getElementById(id) as HTMLElement;
  const childrenDivs = parentDiv.children as HTMLCollection;
  Array.from(childrenDivs).forEach((item) =>
    (item as HTMLElement).style.width = cols
  );
};
export default function ProductListButtons() {
  return <div>áaaa</div>;
}
