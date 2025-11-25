<script>
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  let { class: className = "", inset = false, children, ...rest } = $props();
</script>

<DropdownMenuPrimitive.Item
  {...rest}
  class={cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
    inset && "pl-8",
    className
  )}
>
  {@render children?.()}
</DropdownMenuPrimitive.Item>
