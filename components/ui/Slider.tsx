import type { ComponentChildren, JSX } from "preact";
import { scriptAsDataURI } from "apps/utils/dataURI.ts";
import { clx } from "../../sdk/clx.ts";

function Dot({ index, children, class: _class }: {
  index: number;
  children: ComponentChildren;
  class?: string;
}) {
  return (
    <button
      data-dot={index}
      aria-label={`go to slider item ${index}`}
      class={clx(
        "focus:outline-none group w-full sm:w-auto",
        _class,
      )}
    >
      {children}
    </button>
  );
}

function Slider(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-slider {...props} />;
}

function Item({
  index,
  ...props
}: JSX.IntrinsicElements["li"] & { index: number }) {
  return <li data-slider-item={index} {...props} />;
}

function NextButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-slide="next" aria-label="Next item" {...props} />;
}

function PrevButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-slide="prev" aria-label="Previous item" {...props} />;
}

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto" | "instant";
  interval?: number;
  infinite?: boolean;
  oneByone?: boolean;
}

const setup = ({ rootId, scroll, interval, infinite, oneByone }: Props) => {
  const ATTRIBUTES = {
    "data-slider": "data-slider",
    "data-slider-item": "data-slider-item",
    'data-slide="prev"': 'data-slide="prev"',
    'data-slide="next"': 'data-slide="next"',
    "data-dot": "data-dot",
    "data-progress": "data-progress",
  };

  // Percentage of the item that has to be inside the container
  // for it it be considered as inside the container
  const THRESHOLD = 0.7;
  const USE_INFINITE_BEHAVIOUR = true;

  const intersectionX = (element: DOMRect, container: DOMRect): number => {
    const delta = container.width / 1_000;

    if (element.right < container.left - delta) {
      return 0.0;
    }

    if (element.left > container.right + delta) {
      return 0.0;
    }

    if (element.left < container.left - delta) {
      return element.right - container.left + delta;
    }

    if (element.right > container.right + delta) {
      return container.right - element.left + delta;
    }

    return element.width;
  };

  // as any are ok in typeguard functions
  const isHTMLElement = (x: Element): x is HTMLElement =>
    // deno-lint-ignore no-explicit-any
    typeof (x as any).offsetLeft === "number";

  const root = document.getElementById(rootId);
  const slider = root?.querySelector(`[${ATTRIBUTES["data-slider"]}]`);
  const items = root?.querySelectorAll(`[${ATTRIBUTES["data-slider-item"]}]`);
  const prev = root?.querySelector(`[${ATTRIBUTES['data-slide="prev"']}]`);
  const next = root?.querySelector(`[${ATTRIBUTES['data-slide="next"']}]`);
  const dots = root?.querySelectorAll(`[${ATTRIBUTES["data-dot"]}]`);
  const progress: HTMLProgressElement | null | undefined = root?.querySelector(
    `[${ATTRIBUTES["data-progress"]}]`,
  );

  if (!root || !slider || !items || items.length === 0) {
    console.warn(
      "Missing necessary slider attributes. It will not work as intended. Necessary elements:",
      { root, slider, items, rootId },
    );

    return;
  }

  const getElementsInsideContainer = () => {
    const indices: number[] = [];
    const sliderRect = slider.getBoundingClientRect();

    for (let index = 0; index < items.length; index++) {
      const item = items.item(index);
      const rect = item.getBoundingClientRect();

      const ratio = intersectionX(
        rect,
        sliderRect,
      ) / rect.width;

      if (ratio > THRESHOLD) {
        indices.push(index);
      }
    }

    return indices;
  };

  const elementsInsideContainer = getElementsInsideContainer();
  const infiniteBehavior = infinite && elementsInsideContainer.length === 1 &&
    items.length > 1 && USE_INFINITE_BEHAVIOUR;

  const goToItem = (index: number, behavior = scroll) => {
    const item = slider.querySelector(`li[data-slider-item='${index}']`);
    if (item) {
      if (!isHTMLElement(item as HTMLElement)) {
        console.warn(
          `Element at index ${index} is not an html element. Skipping carousel`,
        );

        return;
      }

      slider.scrollTo({
        top: 0,
        behavior: behavior,
        left: (item as HTMLElement).offsetLeft - root.offsetLeft,
      });
    }
  };

  const onClickPrev = () => {
    const indices = getElementsInsideContainer();
    // Wow! items per page is how many elements are being displayed inside the container!!
    const itemsPerPage = indices.length;

    const isShowingFirst = indices[0] === 0;
    const pageIndex = Math.floor(indices[indices.length - 1] / itemsPerPage);

    if (oneByone) {
      isShowingFirst
        ? (infinite ? goToItem(items.length - 1) : null)
        : goToItem(indices[0] - 1);
    } else {
      goToItem(
        isShowingFirst
          ? (infiniteBehavior ? items.length : items.length - 1)
          : (pageIndex - 1) * itemsPerPage,
      );
    }
  };

  const onClickNext = () => {
    const indices = getElementsInsideContainer();
    // Wow! items per page is how many elements are being displayed inside the container!!
    const itemsPerPage = indices.length;

    const isShowingLast = indices[indices.length - 1] === items.length - 1;
    const pageIndex = Math.floor(indices[0] / itemsPerPage);

    if (oneByone) {
      isShowingLast
        ? (infinite ? goToItem(0) : null)
        : goToItem(indices[0] + 1);
    } else {
      goToItem(
        isShowingLast
          ? (infiniteBehavior ? items.length + 1 : 0)
          : (pageIndex + 1) * itemsPerPage,
      );
    }
  };

  const observer = new IntersectionObserver(
    (elements) => {
      elements.forEach((item) => {
        const index = Number(item.target.getAttribute("data-slider-item")) || 0;
        const dot = dots?.item(index);
        const prevDots = Array.from(dots ?? []).slice(0, index);

        dots?.forEach((dot) => dot.removeAttribute("data-painted"));

        if (item.isIntersecting) {
          prevDots.forEach((dot) => dot.setAttribute("data-painted", "true"));
          dot?.setAttribute("disabled", "true");
        } else {
          dot?.removeAttribute("disabled");
        }

        if (!infinite) {
          if (index === 0) {
            if (item.isIntersecting) {
              prev?.setAttribute("disabled", "");
            } else {
              prev?.removeAttribute("disabled");
            }
          }
          if (index === items.length - 1) {
            if (item.isIntersecting) {
              next?.setAttribute("disabled", "");
            } else {
              next?.removeAttribute("disabled");
            }
          }
          if (progress) {
            if (progress.id == "0" && index === items.length - 1) {
              progress.style.height = `${1 / items.length * 100}%`;
              progress.style.width = `${1 / items.length * 100}%`;
              progress.id = "1";
            } else {
              progress.style.height = `${(index + 1) / items.length * 100}%`;
              progress.style.width = `${(index + 1) / items.length * 100}%`;
            }
          }
        }
      });
    },
    { threshold: THRESHOLD, root: slider, rootMargin: "100px" },
  );

  const fullObserver = new IntersectionObserver((elements) => {
    elements.forEach((item) => {
      const currentItems = slider?.querySelectorAll(`li`);

      if (item.isIntersecting && elements.length == 1) {
        if (item.target == currentItems[1]) {
          setTimeout(() => {
            goToItem(items.length - 1, "instant");
          }, 200);
        }
        if (item.target === currentItems[currentItems.length - 2]) {
          setTimeout(() => {
            goToItem(0, "instant");
          }, 200);
        }
      }
    });
  }, { threshold: 0.70, root: slider, rootMargin: "100px" });

  if (infiniteBehavior) {
    const firstItemClone = items[0].cloneNode(true);
    const secondItemClone = items[1]?.cloneNode(true);
    const penultimateItemClone = items[items.length - 2]?.cloneNode(true);
    const lastItemClone = items[items.length - 1].cloneNode(true);

    (lastItemClone as HTMLElement).setAttribute(
      "data-slider-item",
      items.length.toString(),
    );
    (penultimateItemClone as HTMLElement)?.removeAttribute("data-slider-item");
    (firstItemClone as HTMLElement).setAttribute(
      "data-slider-item",
      (items.length + 1).toString(),
    );
    (secondItemClone as HTMLElement)?.removeAttribute("data-slider-item");

    slider.insertBefore(lastItemClone, items[0]);
    penultimateItemClone &&
      slider.insertBefore(penultimateItemClone, lastItemClone);
    slider.appendChild(firstItemClone);
    secondItemClone && slider.appendChild(secondItemClone);
    goToItem(0, "instant");
  }

  const currentItems = slider?.querySelectorAll(`li`);

  items.forEach((item) => observer.observe(item));

  if (infiniteBehavior) {
    fullObserver.observe(currentItems[1]);
    fullObserver.observe(currentItems[currentItems.length - 2]);
  }

  for (let it = 0; it < (dots?.length ?? 0); it++) {
    dots?.item(it).addEventListener("click", () => goToItem(it));
  }

  prev?.addEventListener("click", onClickPrev);
  next?.addEventListener("click", onClickNext);

  const timeout = interval && setInterval(onClickNext, interval);

  // Unregister callbacks
  return () => {
    for (let it = 0; it < (dots?.length ?? 0); it++) {
      dots?.item(it).removeEventListener("click", () => goToItem(it));
    }

    prev?.removeEventListener("click", onClickPrev);
    next?.removeEventListener("click", onClickNext);
    observer.disconnect();

    clearInterval(timeout);
  };
};

function JS({
  rootId,
  scroll = "smooth",
  interval,
  infinite = false,
  oneByone,
}: Props) {
  return (
    <script
      src={scriptAsDataURI(setup, {
        rootId,
        scroll,
        interval,
        infinite,
        oneByone,
      })}
      defer
    />
  );
}

Slider.Dot = Dot;
Slider.Item = Item;
Slider.NextButton = NextButton;
Slider.PrevButton = PrevButton;
Slider.JS = JS;

export default Slider;
