<script>
  import Switch from "$lib/components/ui/switch.svelte";
  import { themeStore, toggleTheme } from "$lib/stores/theme";

  let isDark = false;

  $: isDark = $themeStore === "dark";

  const handleClick = () => toggleTheme();
</script>

<div class="flex items-center gap-2">
  <Switch checked={isDark} on:change={handleClick} aria-label="Toggle dark mode" />
  <span class="text-sm text-muted-foreground">{isDark ? "Dark" : "Light"}</span>
</div>
