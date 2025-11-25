<script>
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  let { class: className = "", inset = false, children, ...rest } = $props();
</script>

<DropdownMenuPrimitive.Label
  {...rest}
  class={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
>
  {@render children?.()}
</DropdownMenuPrimitive.Label>
