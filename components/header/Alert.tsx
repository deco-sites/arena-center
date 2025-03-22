import { ImageWidget } from "apps/admin/widgets.ts";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import Image from "apps/website/components/Image.tsx";

/** @titleby title */
export interface AlertItem {
  title: string;
  cupom?: string;
  subtitle?: string;
}

/** @title {{contact}} */
export interface ContactItem {
  image: ImageWidget;
  title: string;
  subtitle: string;
  number: number;
  contact: "whatsapp" | "atendimento";
}

export interface Props {
  alerts?: AlertItem[];

  contacts?: ContactItem[];
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function Alert({ alerts = [], interval = 5, contacts }: Props) {
  const id = useId();
  return (
    <div
      id={id}
      class=" w-full bg-gray-300 flex flex-col
    "
    >
      <div class="flex justify-center">
        <Slider class="carousel carousel-center  gap-6  text-accent">
          {alerts.map((alert, index) => (
            <Slider.Item
              index={index}
              class="carousel-item  flex items-center justify-center mx-auto lg:w-[800px]"
            >
              <span
                class="px-2 lg:px-5 py-2 text-center lg:text-base font-bold text-accent-content text-[12px]"
                dangerouslySetInnerHTML={{ __html: alert.title }}
              />

              {alert.cupom && (
                <div class="hidden md:flex ml-2 lg:ml-14 lg:w-[193px] w-[130px] h-6 bg-gray-200 rounded-lg ">
                  <p class="flex items-center justify-center text-base-100 font-bold bg-primary w-16 lg:w-24 h-6 text-center rounded-lg text-[12px] lg:text-[14px]">
                    <span class="top-1">CUPOM</span>
                  </p>
                  <p class="flex items-center justify-center text-primary ml-1 lg:ml-3 font-bold text-[12px] lg:text-sm">
                    <span>{alert.cupom}</span>
                  </p>
                </div>
              )}

              {alert.subtitle && (
                <p class="hidden md:flex text-[10px] w-32 font-light ml-4 text-accent-content">
                  {alert.subtitle}
                </p>
              )}
            </Slider.Item>
          ))}
        </Slider>
        <div class="hidden md:flex gap-6">
          {contacts &&
            contacts.map((contact) => (
              <a
                href={contact.contact === "whatsapp"
                  ? `https://api.whatsapp.com/send/?phone=${contact.number}&text&type=phone_number&app_absent=0`
                  : `tel:${contact.number}`}
                target="blank"
                class="flex items-center"
              >
                <Image
                  src={contact.image}
                  alt={contact.title}
                  width={22}
                  height={22}
                />
                <div class="text-[10px] ml-2">
                  <p>{contact.title}</p>
                  <p>{contact.subtitle}</p>
                </div>
              </a>
            ))}
        </div>
      </div>
      <Slider.JS rootId={id} interval={interval && interval * 1e3} />
    </div>
  );
}

export default Alert;
