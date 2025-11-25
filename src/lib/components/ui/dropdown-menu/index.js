import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export { default as DropdownMenuContent } from "./content.svelte";
export { default as DropdownMenuItem } from "./item.svelte";
export { default as DropdownMenuLabel } from "./label.svelte";
export { default as DropdownMenuSeparator } from "./separator.svelte";
