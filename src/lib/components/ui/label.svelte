<script>
  import { cn } from "$lib/utils";
  let { class: className = "", children, ...rest } = $props();
</script>

<label
  {...rest}
  class={cn(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    className
  )}
>
  {@render children?.()}
</label>
