<script>
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	import { goto, invalidateAll } from "$app/navigation";
	import ThemeToggle from "$lib/components/shared/theme-toggle.svelte";
	import UserMenu from "$lib/components/shared/user-menu.svelte";
	import AppToaster from "$lib/components/shared/app-toaster.svelte";
	import { toast } from "svelte-sonner";

	let { children, data } = $props();
	const navLinks = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/profile", label: "Profile" },
	];

	const handleSignOut = async () => {
		try {
			const response = await fetch("/api/auth/signout", { method: "POST" });
			if (!response.ok) {
				throw new Error("Unable to sign out");
			}
			await invalidateAll();
			toast.success("Signed out");
			goto("/login");
		} catch (error) {
			toast.error(error.message ?? "Sign out failed");
		}
	};

	const handleNavigate = (event) => {
		if (!event?.detail?.href) return;
		goto(event.detail.href);
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Slate – The Task Management</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<header class="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
			<!-- Logo/Brand -->
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2 transition-opacity hover:opacity-80">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">
						S
					</div>
					<span class="text-xl font-bold tracking-tight text-blue-600">Slate</span>
				</a>
				
				{#if data?.user}
					<nav class="hidden items-center gap-1 md:flex">
						{#each navLinks as link}
							<a 
								href={link.href} 
								class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
							>
								{link.label}
							</a>
						{/each}
					</nav>
				{/if}
			</div>

			<!-- Right Side Actions -->
			<div class="flex items-center gap-2">
				<ThemeToggle />
				{#if data?.user}
					<div class="ml-2">
						<UserMenu user={data.user} {handleSignOut} {handleNavigate} />
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<a
							href="/login"
							class="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							Sign in
						</a>
						<a
							href="/signup"
							class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors bg-blue-600 hover:bg-primary/90"
						>
							Get started
						</a>
					</div>
				{/if}
			</div>
		</div>
	</header>
	<main class="mx-auto min-h-[calc(100vh-64px)] w-full max-w-7xl px-6 py-8">
		{@render children()}
	</main>
	<AppToaster />
</div>
