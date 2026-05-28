import type { Snippet } from "svelte";
import type { HTMLLiAttributes } from "svelte/elements";

export type SortItemProps = HTMLLiAttributes & {
  children: Snippet;
  ref?: HTMLLIElement;
};
