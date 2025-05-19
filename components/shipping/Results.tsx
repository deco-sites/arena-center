/**
 * TODO: support other platforms. Currently only for VTEX
 */
import { AppContext } from "apps/vtex/mod.ts";
import type { SKU } from "apps/vtex/utils/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import { ComponentProps } from "../../sections/Component.tsx";
import type { ShippingMethod } from "apps/vnda/utils/client/types.ts";

export interface Props {
  items: SKU[];
}

type ShippingResult = { [key: string]: ShippingMethod[] };

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  try {
    const result = await ctx.invoke("vnda/actions/cart/simulation.ts", {
      skuId: props.items?.[0]?.id,
      zip: `${form.get("postalCode") ?? ""}`,
      quantity: 1,
    }) as ShippingResult | null;
    console.log({ result });
    return { result };
  } catch (error) {
    console.log(error);
    return { result: null };
  }
}

export default function Results({ result }: ComponentProps<typeof action>) {
  const methods = (Object.values(result ?? {})[0] ?? []) as ShippingMethod[];

  if (!methods.length) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <ul class="flex flex-col gap-4 p-4 border border-base-400 rounded">
      {methods.map((method) => (
        <li class="flex justify-start items-center gap-2 border-base-200 not-first-child:border-t">
          <div class="w-[70px] flex-shrink-0 flex justify-between items-center gap-1">
            <p>{method.name}</p>
            <p>-</p>
          </div>
          <p class="text-sm">
            {method.description}
          </p>
          <p class="text-base font-semibold text-right">
            {method.price === 0 ? "Grátis" : (
              formatPrice(method.price, "BRL", "pt-BR")
            )}
          </p>
        </li>
      ))}
      <span class="text-xs font-thin">
        Os prazos de entrega começam a contar a partir da confirmação do
        pagamento e podem variar de acordo com a quantidade de produtos na
        sacola.
      </span>
    </ul>
  );
}
