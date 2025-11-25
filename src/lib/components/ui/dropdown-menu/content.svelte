<script>
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  let {
    class: className = "",
    align = "end",
    sideOffset = 8,
    children,
    ...rest
  } = $props();
</script>

<DropdownMenuPrimitive.Content
  {...rest}
  align={align}
  sideOffset={sideOffset}
  class={cn(
    "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
    className
  )}
>
  {@render children?.()}
</DropdownMenuPrimitive.Content>
