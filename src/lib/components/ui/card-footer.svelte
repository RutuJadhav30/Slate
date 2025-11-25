<script>
  import { cn } from "$lib/utils";
  let { class: className = "", children, ...rest } = $props();
</script>

<div {...rest} class={cn("flex items-center p-6 pt-0", className)}>
  {@render children?.()}
</div>
