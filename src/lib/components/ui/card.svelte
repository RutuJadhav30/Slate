<script>
  import { cn } from "$lib/utils";
  let { class: className = "", children, ...rest } = $props();
</script>

<div
  {...rest}
  class={cn(
    "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
    className
  )}
>
  {@render children?.()}
</div>
