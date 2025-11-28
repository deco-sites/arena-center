import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  src: ImageWidget;
  link?: string;
  width: number;
  height: number;
}

export default function GreaterBanner(props: Props) {
  return (
    <a href={props.link}>
      <Image
        class="w-full"
        src={props.src}
        width={props.width}
        height={props.height}
        loading="eager"
        preload
      />
    </a>
  );
}