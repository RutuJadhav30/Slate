<script>
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  let { class: className = "", ...rest } = $props();
</script>

<DropdownMenuPrimitive.Separator
  {...rest}
  class={cn("-mx-1 my-1 h-px bg-muted", className)}
/>
