import { scriptAsDataURI } from "apps/utils/dataURI.ts";
import type { ComponentChildren, JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

type WithoutRootId<T> = Omit<T, "rootId">;

type DotProps = {
  children?: ComponentChildren;
  rootId?: string;
  class?: string;
};

type DotsProps = JSX.IntrinsicElements["div"] & {
  children: ComponentChildren;
};

function Dots({ children, ...props }: DotsProps) {
  return (
    <div data-dots class={clx(props.class, props.className)}>
      {children}
    </div>
  );
}

function Dot({ children, class: _class }: DotProps) {
  return (
    <button
      type="button"
      data-dot
      class={clx(
        "focus:outline-none group w-full sm:w-auto",
        _class,
      )}
    >
      {children}
    </button>
  );
}

type SliderProps = JSX.IntrinsicElements["ul"] & {
  rootId?: string;
};

function Slider({ rootId, class: className, ...props }: SliderProps) {
  return (
    <div data-viewport class={clx("embla embla__viewport")}>
      <ul
        data-root={rootId}
        class={clx(
          "embla__container",
          "data-[draggable='true']:[scroll-snap-type:none] group/slider",
          className,
        )}
        {...props}
      />
    </div>
  );
}

type ItemProps = JSX.IntrinsicElements["li"] & {
  index: number;
  rootId?: string;
  children?: ComponentChildren;
};

function Item({ index, rootId, class: _class, ...props }: ItemProps) {
  return (
    <li
      class={clx("embla__slide", _class)}
      data-root={rootId}
      data-slider-item={index}
      {...props}
    />
  );
}

type ButtonProps = JSX.IntrinsicElements["button"] & { rootId?: string };

function NextButton({ rootId, ...props }: ButtonProps) {
  return (
    <button
      data-root={rootId}
      data-slide="next"
      aria-label="Next item"
      {...props}
    />
  );
}

function PrevButton({ rootId, ...props }: ButtonProps) {
  return (
    <button
      data-root={rootId}
      data-slide="prev"
      aria-label="Previous item"
      {...props}
    />
  );
}

// export interface Props {
//   rootId: string;
//   scroll?: "smooth" | "auto" | "instant";
//   interval?: number;
//   infinite?: boolean;
//   oneByone?: boolean;
//   /**
//    * Set to true if you want to create dots per page, instead of creating per item
//    */
//   pageDots?: boolean;
//   isFromHook?: boolean;
//   desktopDraggable?: boolean;
// }

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
  align?: "start" | "center" | "end";
  startIndex?: number;
  controlDots?: boolean;
}

const setup = (
  {
    rootId,
    infinite,
    // scroll,
    interval,
    align = "start",
    startIndex = 0,
    controlDots,
  }: Props,
) => {
  const root = document.getElementById(rootId);
  if (!root) {
    throw new Error(`Root element with id ${rootId} not found`);
  }

  const viewport = root.querySelector("[data-viewport]");
  if (!viewport) {
    throw new Error(`Viewport element with data-viewport not found`);
  }

  const nextButton = root.querySelector("[data-slide='next']");
  const prevButton = root.querySelector("[data-slide='prev']");
  const dots = controlDots
    ? root.querySelectorAll("[data-dot]")
    : root.querySelector("[data-dots]");

  const options = {
    loop: infinite,
    slidesToScroll: "auto",
    startIndex,
    align,
    dragFree: true,
  };
  const autoplay = interval && interval > 0
    // @ts-ignore ignore typing
    ? EmblaCarouselAutoplay({ stopOnInteraction: false, delay: interval })
    : null;
  const plugins = [autoplay].filter(Boolean);
  // @ts-ignore ignore typing
  const embla = EmblaCarousel(viewport, options, plugins);

  prevButton?.addEventListener("click", () => {
    autoplay?.reset();
    embla.scrollPrev();
  }, false);
  nextButton?.addEventListener("click", () => {
    autoplay?.reset();
    embla.scrollNext();
  }, false);

  if (dots && controlDots) {
    (dots as NodeListOf<Element>).forEach((dotNode, index) => {
      dotNode.addEventListener("click", () => {
        autoplay?.reset();
        embla.scrollTo(index);
      }, false);
    });
  }

  if (dots && !controlDots) {
    let dotNodes: HTMLElement[] = [];
    const dotElement = (dots as Element).innerHTML;

    const setupDots = (): void => {
      (dots as Element).innerHTML = embla
        .scrollSnapList()
        .map(() => dotElement)
        .join("");

      const scrollTo = (index: number): void => {
        embla.scrollTo(index);
      };

      dotNodes = Array.from((dots as Element).querySelectorAll("[data-dot]"));
      dotNodes.forEach((dotNode, index) => {
        dotNode.addEventListener("click", () => {
          autoplay?.reset();
          scrollTo(index);
        }, false);
      });
    };

    const toggleActiveDot = (): void => {
      const previous = embla.previousScrollSnap();
      const selected = embla.selectedScrollSnap();
      dotNodes[previous]?.removeAttribute("data-selected");
      dotNodes[selected]?.setAttribute("data-selected", "");
      dotNodes.forEach((dot, index) => {
        if (
          (index < selected) &&
          !(selected === 0 && previous === dotNodes.length - 1)
        ) {
          dot?.setAttribute("data-painted", "true");
        } else {
          dot?.removeAttribute("data-painted");
        }
      });
    };

    embla
      .on("init", setupDots)
      .on("reInit", setupDots)
      .on("init", toggleActiveDot)
      .on("reInit", toggleActiveDot)
      .on("select", toggleActiveDot);
  }
};

function JS(props: Props) {
  return (
    <script
      src={scriptAsDataURI(setup, { ...props })}
      defer
    />
  );
}

Slider.Dot = Dot;
Slider.Dots = Dots;
Slider.Item = Item;
Slider.NextButton = NextButton;
Slider.PrevButton = PrevButton;
Slider.JS = JS;

export function useSlider(rootId: string) {
  return {
    Carousel: (props: WithoutRootId<SliderProps>) => (
      <Slider {...props} rootId={rootId} />
    ),
    Item: (props: WithoutRootId<ItemProps>) => (
      <Item {...props} rootId={rootId} />
    ),
    Dot: (props: WithoutRootId<DotProps>) => <Dot {...props} rootId={rootId} />,
    NextButton: (props: WithoutRootId<ButtonProps>) => (
      <NextButton {...props} rootId={rootId} />
    ),
    PrevButton: (props: WithoutRootId<ButtonProps>) => (
      <PrevButton {...props} rootId={rootId} />
    ),
    JS: (props: Props) => <JS {...props} />,
  };
}

export default Slider;
