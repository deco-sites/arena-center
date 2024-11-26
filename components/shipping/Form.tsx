import type { SKU } from "apps/vtex/utils/types.ts";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../../sections/Component.tsx";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  items: SKU[];
}

export default function Form({ items }: Props) {
  const slot = useId();

  return (
    <div class="flex flex-col gap-2 border-t-[1px] border-gray-300 pt-5 px-3 ">
      <div class="flex flex-col">
        <div class="flex">
          <Image
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/arena-center/20fb66e2-12c9-4fac-b845-151d9728789c/frete.svg"
            width={28}
            height={17}
            alt="icone de um caminhão de entrega"
          />
          <p class="ml-2 font-semibold">Calcule o frete</p>
        </div>

        <span class="text-[#616B6B] text-[10px] pt-2 ">
          Informe seu CEP para consultar os prazos de entrega
        </span>
      </div>

      <form
        class="relative join mb-1"
        hx-target={`#${slot}`}
        hx-swap="innerHTML"
        hx-sync="this:replace"
        hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
          items,
        })}
      >
        <input
          as="input"
          type="text"
          class="input  join-item md:w-[280px] w-48 h-9 bg-accent-content bg-opacity-10 placeholder:text-[10px] text-sm rounded "
          placeholder="Digite aqui o CEP"
          name="postalCode"
          maxLength={8}
          size={8}
        />
        <button
          type="submit"
          class="btn join-item no-animation btn-outline w-[161px] h-9 ml-3 min-h-0 rounded "
        >
          <span class="[.htmx-request_&]:hidden inline text-[10px]">
            Calcular
          </span>
          <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
        </button>
      </form>

      {/* Results Slot */}
      <div id={slot} />
    </div>
  );
}
