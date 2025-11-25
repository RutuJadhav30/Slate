<script>
  import Card from "$lib/components/ui/card.svelte";
  import CardContent from "$lib/components/ui/card-content.svelte";
  import CardDescription from "$lib/components/ui/card-description.svelte";
  import CardHeader from "$lib/components/ui/card-header.svelte";
  import CardTitle from "$lib/components/ui/card-title.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import Label from "$lib/components/ui/label.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";

  export let form;

  let showPassword = false;
  let isSubmitting = false;

  // React to successful server result (redirects via goto)
  $: if (form?.success) {
    if (form.emailConfirmationRequired) {
      toast.success("Check your email to confirm your registration");
      goto("/login");
    } else {
      toast.success("Account created successfully!");
      goto("/dashboard");
    }
  }
</script>

<Card class="mx-auto max-w-xl shadow-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-300/40">
  <CardHeader>
    <CardTitle class="text-indigo-700">Create your workspace</CardTitle>
    <CardDescription class="text-purple-700/80">Spin up a collaborative task board in minutes.</CardDescription>
  </CardHeader>
  <CardContent>
    <form method="POST" class="space-y-5" use:enhance on:submit={() => (isSubmitting = true)}>
      <div class="space-y-2">
        <Label for="name" class="text-indigo-700">Full name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          required
          value={form?.values?.name ?? ""}
          class="border-purple-400/60 focus:border-indigo-600 focus:ring-indigo-600 bg-white/80"
        />
        {#if form?.errors?.fieldErrors?.name?.[0]}
          <p class="text-sm text-red-600">{form.errors.fieldErrors.name[0]}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <Label for="email" class="text-indigo-700">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
          value={form?.values?.email ?? ""}
          class="border-purple-400/60 focus:border-indigo-600 focus:ring-indigo-600 bg-white/80"
        />
        {#if form?.errors?.fieldErrors?.email?.[0]}
          <p class="text-sm text-red-600">{form.errors.fieldErrors.email[0]}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label for="password" class="text-indigo-700">Password</Label>
        </div>

        <div class="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Strong password"
            required
            class="pr-10 border-purple-400/60 focus:border-indigo-600 focus:ring-indigo-600 bg-white/80"
          />
          <button
            type="button"
            on:click={() => (showPassword = !showPassword)}
            class="absolute right-3 top-1/2 -translate-y-1/2 text-purple-700/70 hover:text-indigo-700 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {#if showPassword}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            {/if}
          </button>
        </div>

        {#if form?.errors?.fieldErrors?.password?.[0]}
          <p class="text-sm text-red-600">{form.errors.fieldErrors.password[0]}</p>
        {/if}
      </div>

      {#if form?.message}
        <div class="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {form.message}
        </div>
      {/if}

      <Button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" disabled={isSubmitting}>
        {#if isSubmitting}
          Creating...
        {:else}
          Create account
        {/if}
      </Button>
    </form>

    <p class="mt-4 text-center text-sm text-purple-700/80">
      Already have an account?
      <a href="/login" class="text-indigo-700 underline-offset-4 hover:underline">Sign in</a>
    </p>
  </CardContent>
</Card>
