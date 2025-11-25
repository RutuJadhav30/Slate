<script>
  import { cn } from "$lib/utils";

  let {
    class: className = "",
    placeholder = "Select...",
    options = [],
    value = undefined,
    ...rest
  } = $props();
</script>

<div class="relative">
  <select
    {...rest}
    class={cn(
      "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    value={value}
  >
    <option value="" disabled selected={value === undefined || value === ""}>
      {placeholder}
    </option>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </span>
</div>
