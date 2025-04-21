import { ImageWidget } from "apps/admin/widgets.ts";
import { AppContext } from "../../apps/site.ts";
import Icon from "../../components/ui/Icon.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useComponent } from "../Component.tsx";
import { type SectionProps } from "@deco/deco";
import Image from "apps/website/components/Image.tsx";

export interface NoticeProps {
  title?: string;
  description?: string;
}
export interface Props {
  empty?: NoticeProps;
  success?: NoticeProps;
  failed?: NoticeProps;
  /** @description Signup label */
  label?: string;
  /** @description Input placeholder */
  placeholder?: string;
  /** @ignore true */
  status?: "success" | "failed";
  logo: ImageWidget;
  consentText: string;
}
export async function action(props: Props, req: Request, ctx: AppContext) {
  const platform = usePlatform();
  const form = await req.formData();
  const email = `${form.get("email") ?? ""}`;
  if (platform === "vtex") {
    // deno-lint-ignore no-explicit-any
    await (ctx as any).invoke("vtex/actions/newsletter/subscribe.ts", {
      email,
    });
    return { ...props, status: "success" };
  }
  return { ...props, status: "failed" };
}
export function loader(props: Props) {
  return { ...props, status: undefined };
}
function Notice({ title, description }: {
  title?: string;
  description?: string;
}) {
  return (
    <div class="w-full max-w-[1200px] pb-1">
      <div class="flex flex-col justify-center mx-auto items-center  gap-4">
        <p class="text-[22px] mb-4 font-medium text-center md:ml-[-240px]">
          {title}
        </p>
      </div>
      <span class="text-xs font-normal text-base-400 text-center sm:text-start">
        {description}
      </span>
    </div>
  );
}
function Newsletter({
  empty = {
    title: "Get top deals, latest trends, and more.",
    description:
      "Receive our news and promotions in advance. Enjoy and get 10% off your first purchase. For more information click here.",
  },
  success = {
    title: "Thank you for subscribing!",
    description:
      "You’re now signed up to receive the latest news, trends, and exclusive promotions directly to your inbox. Stay tuned!",
  },
  failed = {
    title: "Oops. Something went wrong!",
    description:
      "Something went wrong. Please try again. If the problem persists, please contact us.",
  },
  label = "Sign up",
  placeholder = "Enter your email address",
  status,
  logo,
  consentText,
}: SectionProps<typeof loader, typeof action>) {
  if (status === "success" || status === "failed") {
    return (
      <div class="bg-primary flex gap-4 sm:gap-6 w-full py-5 sm:py-10">
        <div class="p-2 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
          <Icon
            size={80}
            class={clx(status === "success" ? "text-success" : "text-error")}
            id={status === "success" ? "check-circle" : "error"}
          />
          <Notice {...status === "success" ? success : failed} />
        </div>
      </div>
    );
  }
  return (
    <div class="bg-primary flex flex-col md:flex-row gap-8 items-center md:gap-4 sm:gap-6 w-80% md:px-10 max-w-[1440px] py-5 sm:pb-5 sm:pt-4">
      <Image class="object-contain" src={logo} width={240} height={40} />
      <div class="flex flex-col pb-1 w-full max-w-[570px] lg:ml-[100px]">
        <Notice {...empty} />
        <form
          hx-target="closest section"
          hx-swap="outerHTML"
          hx-post={useComponent(import.meta.url)}
          class="flex flex-col sm:flex-row md:items-center gap-4 w-full"
        >
          <input
            name="email"
            class="input-bordered text-xs px-4 py-1 flex-grow rounded-sm"
            type="text"
            placeholder={placeholder}
          />
          <button
            class="bg-accent-content mx-auto h-5 text-primary-content text-xs px-8 rounded-lg"
            type="submit"
          >
            <span class="[.htmx-request_&]:hidden inline">{label}</span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
          </button>
        </form>
        <span class="text-[10px] mt-[6px]">{consentText}</span>
      </div>
    </div>
  );
}
export const LoadingFallback = () => <Section.Placeholder height="412px" />;
export default Newsletter;
