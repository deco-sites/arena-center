import { clx } from "site/sdk/clx.ts";

export interface Props {
  text: string;
  class?: string;
}

function Tag({ text, class: _class }: Props) {
  return (
    <div
      class={clx(
        "text-[12px] font-normal text-base-100  bg-primary  text-center rounded-[4px] px-2 py-1",
        _class,
      )}
    >
      {text}
    </div>
  );
}

export default Tag;
