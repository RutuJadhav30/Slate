<script>
  import { createEventDispatcher } from "svelte";
  import { cn } from "$lib/utils";

  const dispatch = createEventDispatcher();

  let { checked = false, class: className = "", disabled = false, ...rest } = $props();

  const toggle = () => {
    if (disabled) return;
    dispatch("change", !checked);
  };
</script>

<button
  {...rest}
  type="button"
  role="switch"
  aria-checked={checked}
  aria-disabled={disabled}
  aria-label="Toggle setting"
  class={cn(
    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    checked ? "bg-primary" : "bg-muted",
    disabled && "cursor-not-allowed opacity-60",
    className
  )}
  onclick={toggle}
>
  <span
    class={cn(
      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition",
      checked ? "translate-x-5" : "translate-x-0.5"
    )}
  ></span>
</button>
