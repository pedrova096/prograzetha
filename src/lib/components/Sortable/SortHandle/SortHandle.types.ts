import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

export type SortHandleProps = HTMLButtonAttributes & {
  children: Snippet;
};
