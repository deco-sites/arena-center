import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  src: ImageWidget;
  width: number;
  height: number;
}

export default function GreaterBanner(props: Props) {
  return (
    <div>
      <Image
        class="w-full"
        src={props.src}
        width={props.width}
        height={props.height}
        loading="eager"
        preload
      />
    </div>
  );
}
