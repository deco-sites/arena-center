/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */
import { Suggestion } from "apps/commerce/types.ts";
import {
  SEARCHBAR_INPUT_FORM_ID,
  SEARCHBAR_POPUP_ID,
} from "../../../constants.ts";
import { useId } from "../../../sdk/useId.ts";
import { useComponent } from "../../../sections/Component.tsx";
import Icon from "../../ui/Icon.tsx";
import { Props as SuggestionProps } from "./Suggestions.tsx";
import { useScript } from "@deco/deco/hooks";
import { asResolved } from "@deco/deco";
import { type Resolved } from "@deco/deco";
import Image from "apps/website/components/Image.tsx";
// When user clicks on the search button, navigate it to
export const ACTION = "/s";
// Querystring param used when navigating the user
export const NAME = "q";
export interface SearchbarProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /** @description Loader to run when suggesting new elements */
  loader: Resolved<Suggestion | null>;
}
const script = (formId: string, name: string, popupId: string) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const input = form?.elements.namedItem(name) as HTMLInputElement | null;
  form?.addEventListener("submit", () => {
    const search_term = input?.value;
    if (search_term) {
      window.DECO.events.dispatch({
        name: "search",
        params: { search_term },
      });
    }
  });
  // Keyboard event listeners
  addEventListener("keydown", (e: KeyboardEvent) => {
    const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;
    // Open Searchbar on meta+k
    if (e.metaKey === true && isK) {
      const input = document.getElementById(popupId) as HTMLInputElement | null;
      if (input) {
        input.checked = true;
        document.getElementById(formId)?.focus();
      }
    }
  });
};

export default function Searchbar({
  placeholder = "What are you looking for?",
  loader,
}: SearchbarProps) {
  const slot = useId();
  return (
    <div
      class="lg:w-[407px] w-[90vw] lg:h-8 h-10 border border-gray-200 lg:bg-gray-100 bg-base-100 rounded-full my-2 lg:my-0 "
      style={{ gridTemplateRows: "min-content auto" }}
    >
      <form id={SEARCHBAR_INPUT_FORM_ID} action={ACTION} class="join">
        <button
          type="submit"
          class=" join-item ml-2 "
          aria-label="Search"
          for={SEARCHBAR_INPUT_FORM_ID}
          tabIndex={-1}
        >
          <span class="loading loading-spinner loading-xs hidden [.htmx-request_&]:inline" />
          <Image
            id="search"
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/arena-center/2737a7a2-66a0-45ef-aff9-ae6065f16919/search.svg"
            alt="icone de pesquisa"
            width={20}
            height={20}
          />
        </button>
        <input
          tabIndex={0}
          class="input  join-item bg-transparent lg:bg-gray-100 min-h-0 lg:h-7 h-9  placeholder:text-[10px] lg:w-96 w-[88vw]"
          name={NAME}
          placeholder={placeholder}
          autocomplete="off"
          hx-target={`#${slot}`}
          hx-trigger={`input changed delay:300ms, ${NAME}`}
          hx-indicator={`#${SEARCHBAR_INPUT_FORM_ID}`}
          hx-swap="innerHTML"
        />
      </form>

      {/* Suggestions slot */}
      <div id={slot} />

      {/* Send search events as the user types */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            script,
            SEARCHBAR_INPUT_FORM_ID,
            NAME,
            SEARCHBAR_POPUP_ID
          ),
        }}
      />
    </div>
  );
}
