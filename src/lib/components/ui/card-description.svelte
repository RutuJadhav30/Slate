<script>
  import { cn } from "$lib/utils";
  let { class: className = "", children, ...rest } = $props();
</script>

<p {...rest} class={cn("text-sm text-muted-foreground", className)}>
  {@render children?.()}
</p>
