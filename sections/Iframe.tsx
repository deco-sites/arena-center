import { useEffect, useRef } from "preact/hooks";

export interface Props {
  src: string;
  minHeight: number;
}

const Iframe = ({ src, minHeight, origin }: ReturnType<typeof loader>) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleResize = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.style.height = `${
        iframe.contentWindow!.document.documentElement.scrollHeight
      }px`;
    }
  };

  const handleMessage = (event: MessageEvent) => {
    if (event.data === "iframeResize") {
      handleResize();
    }
  };

  const observeIframeChanges = () => {
    const observer = new MutationObserver(handleResize);
    observer.observe(iframeRef.current!.contentDocument!.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    return observer;
  };

  const verificarURL = (interval: number) => {
    const url = new URL(
      iframeRef.current?.contentWindow?.document.location.href ?? src,
    );
    const isAboutBlank =
      iframeRef.current!.contentWindow!.document.location.href ===
        "about:blank";
    const isTheSamePath = url.pathname !== src;
    console.log(
      isTheSamePath,
      iframeRef.current?.contentWindow?.document.location.href,
    );

    if (!isAboutBlank && isTheSamePath) {
      window.location.href =
        iframeRef.current!.contentWindow!.document.location.href;
      clearInterval(interval);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;

    const interval = setInterval(() => verificarURL(interval), 100);

    iframe?.addEventListener("load", () => {
      handleResize();
      observeIframeChanges();
      iframe.contentWindow?.addEventListener("resize", handleResize);
      iframe.contentWindow?.addEventListener("message", handleMessage);
    });

    return () => {
      clearInterval(interval);
      iframe?.contentWindow?.removeEventListener("resize", handleResize);
      iframe?.contentWindow?.removeEventListener("message", handleMessage);
    };
  }, [src]);

  return (
    <iframe
      title="ArenaCenter Iframe"
      src={`${origin}${src}`}
      ref={iframeRef}
      frameBorder="0"
      style={{ width: "100%", border: "none", minHeight }}
      allowFullScreen
    />
  );
};

export function loader(props: Props, req: Request) {
  const url = new URL(req.url);
  return {
    ...props,
    origin: url.origin,
  };
}

export default Iframe;
