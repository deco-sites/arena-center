import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface FirstImage {
  desktop: ImageWidget;
  width: number;
  height: number;
  mobile?: ImageWidget;
}
export interface SecondImage {
  desktop: ImageWidget;
  width: number;
  height: number;
  mobile?: ImageWidget;
}

export interface ThirdImage {
  desktop: ImageWidget;
  width: number;
  height: number;
  mobile?: ImageWidget;
}

export interface Props {
  firstImage: FirstImage;
  secondImage: SecondImage;
  thirdImage: ThirdImage;
}

export default function ({ firstImage, secondImage, thirdImage }: Props) {
  return (
    <div class="flex gap-2 pt-8 px-10">
      <div class="">
        <Image
          src={firstImage.desktop}
          width={firstImage.width}
          height={firstImage.height}
          loading={"lazy"}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Image
          src={secondImage.desktop}
          width={secondImage.width}
          height={secondImage.height}
          loading={"lazy"}
        />
        <Image
          src={thirdImage.desktop}
          width={thirdImage.width}
          height={thirdImage.height}
          loading={"lazy"}
        />
      </div>
    </div>
  );
}
