<script>
  import Card from "$lib/components/ui/card.svelte";
  import CardContent from "$lib/components/ui/card-content.svelte";
  import CardDescription from "$lib/components/ui/card-description.svelte";
  import CardHeader from "$lib/components/ui/card-header.svelte";
  import CardTitle from "$lib/components/ui/card-title.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import Label from "$lib/components/ui/label.svelte";
  import Button from "$lib/components/ui/button.svelte";

  export let form;
  export let data;

  $: submitted = form?.ok;
</script>

<Card class="mx-auto max-w-lg shadow-xl">
  <CardHeader>
    <CardTitle>Reset password</CardTitle>
    <CardDescription>{data.message}</CardDescription>
  </CardHeader>
  <CardContent>
    <form method="POST" class="space-y-4">
      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@company.com" />
      </div>
      {#if form?.message}
        <p class="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{form.message}</p>
      {/if}
      {#if submitted}
        <p class="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Check your inbox for the next steps.
        </p>
      {/if}
      <Button type="submit" class="w-full">Send reset link</Button>
    </form>
  </CardContent>
</Card>
