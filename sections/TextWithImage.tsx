import type { ImageWidget } from "apps/admin/widgets.ts";
import type { HTMLWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

/** @titleby label */
export interface ServiceProps {
  /** @title titulo */
  label?: string;
  description?: HTMLWidget;
  image: ImageWidget;
  placement: "left" | "right";
}

export interface Props {
  services?: ServiceProps[];
}

const PLACEMENT = {
  left: "flex-col lg:flex-row-reverse",
  right: "flex-col lg:flex-row",
};

export default function Services({
  services = [
    {
      label: "Your Title Here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam id tincidunt dapibus, elit arcu ultricies massa, quis ornare nisl libero vitae urna.",
      image:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/3290/488e5dc5-9a24-48c9-9795-09b97394fb5f",
      placement: "right",
    },
  ],
}: Props) {
  return (
    <div class="flex flex-col w-screen items-center pt-4 mt-11">
      {services?.map((service, index) => (
        <div class="lg:w-[1440px] ">
          <div
            key={index}
            class={`flex first:pt-0 py-[33px] flex-wrap gap-4 ${
              PLACEMENT[service.placement]
            } text-left items-center justify-center px-10`}
          >
            <div class="xl:h-[495px] lg:w-[495px]  w-[338px] h-[398px] ">
              <Image
                class="w-full h-full object-contain order-3 p-2"
                src={service.image}
                alt={service.label}
                decoding="async"
                loading="lazy"
                width={338}
                height={398}
              />
            </div>
            <div class="xl:w-[600px] lg:w-[500px] text-xs flex items-start gap-2 flex-col lg:mx-0">
              <p class="text-primary text-xl font-bold uppercase">
                {service.label}
              </p>
              <p
                class="text-primary font-normal text-xs"
                dangerouslySetInnerHTML={{ __html: service.description || "" }}
              >
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
