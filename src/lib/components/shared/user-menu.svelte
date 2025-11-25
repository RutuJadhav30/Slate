<script>
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import Button from "$lib/components/ui/button.svelte";

  let { user, handleSignOut, handleNavigate } = $props();
  let open = $state(false);
  let menuRef = $state(/** @type {HTMLElement | null} */ (null));

  const toggleMenu = () => {
    open = !open;
  };

  const closeMenu = () => {
    open = false;
  };

  const initials = user?.name
    ? /** @type {string[]} */ (user.name.split(" "))
        .slice(0, 2)
        .map((part) => /** @type {string} */ (part)[0] ?? "")
        .join("")
        .toUpperCase()
    : "?";

  /** @param {MouseEvent} event */
  const handleDocumentClick = (event) => {
    if (!browser || !open) return;
    if (!menuRef?.contains(/** @type {Node} */ (event.target))) {
      closeMenu();
    }
  };

  /** @param {KeyboardEvent} event */
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  };

  onMount(() => {
    if (!browser) return;
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);
  });

  onDestroy(() => {
    if (!browser) return;
    document.removeEventListener("click", handleDocumentClick);
    document.removeEventListener("keydown", handleKeyDown);
  });

  /** @param {string} href */
  const navigate = (href) => {
    handleNavigate?.({ detail: { href } });
    closeMenu();
  };

  const signOut = () => {
    handleSignOut?.();
    closeMenu();
  };
</script>

<div class="relative" bind:this={menuRef}>
  <Button
    variant="ghost"
    size="sm"
    aria-haspopup="menu"
    aria-expanded={open}
    onclick={toggleMenu}
    class="flex items-center gap-2 px-2 py-1"
  >
    <span class="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
      {initials}
    </span>
    <span class="hidden text-left text-sm font-medium text-blue-600 sm:block">
      {user?.name}
      <span class="block text-xs font-normal text-muted-foreground">{user?.email}</span>
    </span>
  </Button>

  {#if open}
    <div class="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-popover p-2 text-sm shadow-lg">
      <button class="menu-item" onclick={() => navigate("/profile")}>Profile</button>
      <div class="my-2 h-px bg-border" aria-hidden="true"></div>
      <button class="menu-item text-destructive" onclick={signOut}>Sign out</button>
    </div>
  {/if}
</div>

<style>
  .menu-item {
    width: 100%;
    text-align: left;
    border-radius: 0.5rem;
    padding: 0.35rem 0.5rem;
    transition: background-color 0.15s ease;
  }

  .menu-item:hover {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
</style>
