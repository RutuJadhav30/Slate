<script>
  import { cn } from "$lib/utils";
  let { class: className = "", children, ...rest } = $props();
</script>

<h3 {...rest} class={cn("text-lg font-semibold leading-none tracking-tight", className)}>
  {@render children?.()}
</h3>
