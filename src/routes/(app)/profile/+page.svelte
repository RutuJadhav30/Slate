<script>
  import Badge from "$lib/components/ui/badge.svelte";
  import Card from "$lib/components/ui/card.svelte";
  import CardContent from "$lib/components/ui/card-content.svelte";
  import CardHeader from "$lib/components/ui/card-header.svelte";
  import CardTitle from "$lib/components/ui/card-title.svelte";
  import { formatDate } from "$lib/utils";
  import Button from "$lib/components/ui/button.svelte";

  // same prop pattern as Dashboard
  export let data;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = {
    rose: "bg-rose-500",
    amber: "bg-amber-400",
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    violet: "bg-violet-500",
    pink: "bg-pink-500",
  };

  const priorityAccent = {
    High: "border-red-500",
    Medium: "border-amber-400",
    Low: "border-emerald-400",
  };

  // small helper to keep consistent stat progress visuals
  const statProgress = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.round((value / total) * 100));
  };
</script>

<section class="space-y-8">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm uppercase tracking-wide text-purple-700/80">Profile</p>
      <h1 class="text-3xl font-semibold text-indigo-700">Your Profile</h1>
      <p class="mt-1 text-sm text-purple-700/80">Personal info and quick overview of your tasks.</p>
    </div>
  </div>

  <!-- User Details Card (dashboard-styled) -->
  <Card class="shadow-sm bg-gradient-to-br from-indigo-500/6 via-purple-500/6 to-pink-500/6 border border-purple-300/30 rounded-xl">
    <CardHeader>
      <CardTitle class="text-indigo-700">User Details</CardTitle>
    </CardHeader>
    <CardContent class="p-6">
      <div class="flex items-center gap-6">
        <!-- Profile Picture -->
        <div
          class={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white shadow-md ${
            avatarColors[data.user?.avatarColor] ?? "bg-sky-500"
          }`}
        >
          {getInitials(data.user?.name)}
        </div>

        <!-- User Info -->
        <div class="grid flex-1 gap-4 md:grid-cols-3">
          <div class="rounded-xl border border-purple-300/40 bg-white/90 px-4 py-3">
            <p class="text-xs uppercase tracking-wide text-purple-700/80">Name</p>
            <p class="font-semibold text-indigo-700">{data.user?.name}</p>
          </div>

          <div class="rounded-xl border border-purple-300/40 bg-white/90 px-4 py-3">
            <p class="text-xs uppercase tracking-wide text-purple-700/80">Email</p>
            <p class="font-medium text-indigo-700">{data.user?.email}</p>
          </div>

          <div class="rounded-xl border border-purple-300/40 bg-white/90 px-4 py-3">
            <p class="text-xs uppercase tracking-wide text-purple-700/80">Joined</p>
            <p class="text-sm font-semibold text-indigo-700">{formatDate(data.user?.createdAt)}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Task Statistics Card (matching Dashboard look) -->
  <Card class="shadow-sm bg-gradient-to-br from-indigo-500/6 via-purple-500/6 to-pink-500/6 border border-purple-300/30 rounded-xl">
    <CardHeader>
      <CardTitle class="text-indigo-700">Task Overview</CardTitle>
    </CardHeader>
    <CardContent class="p-6">
      <div class="grid grid-cols-4 gap-4 text-center">
        <div class="rounded-xl border border-purple-300/40 bg-white/90 p-4">
          <p class="text-3xl font-bold text-indigo-700">{data.stats?.total ?? 0}</p>
          <p class="text-xs text-purple-700/80 uppercase tracking-wide">Total Tasks</p>
          <div class="mt-3 h-2 w-full rounded-full bg-white/30 overflow-hidden">
            <div class="h-2 rounded-full bg-indigo-600 transition-all" style="width: {statProgress(data.stats?.completed, data.stats?.total)}%"></div>
          </div>
          <p class="mt-2 text-xs text-purple-700/70">{statProgress(data.stats?.completed, data.stats?.total)}% completed</p>
        </div>

        <div class="rounded-xl border border-purple-300/40 bg-white/90 p-4">
          <p class="text-3xl font-bold text-indigo-700">{data.stats?.pending ?? 0}</p>
          <p class="text-xs text-purple-700/80 uppercase tracking-wide">Pending</p>
          <div class="mt-3 h-2 w-full rounded-full bg-white/30 overflow-hidden">
            <div class="h-2 rounded-full bg-purple-600 transition-all" style="width: {statProgress(data.stats?.pending, data.stats?.total)}%"></div>
          </div>
        </div>

        <div class="rounded-xl border border-purple-300/40 bg-white/90 p-4">
          <p class="text-3xl font-bold text-indigo-700">{data.stats?.inProgress ?? 0}</p>
          <p class="text-xs text-purple-700/80 uppercase tracking-wide">In Progress</p>
          <div class="mt-3 h-2 w-full rounded-full bg-white/30 overflow-hidden">
            <div class="h-2 rounded-full bg-amber-500 transition-all" style="width: {statProgress(data.stats?.inProgress, data.stats?.total)}%"></div>
          </div>
        </div>

        <div class="rounded-xl border border-purple-300/40 bg-white/90 p-4">
          <p class="text-3xl font-bold text-indigo-700">{data.stats?.completed ?? 0}</p>
          <p class="text-xs text-purple-700/80 uppercase tracking-wide">Completed</p>
          <div class="mt-3 h-2 w-full rounded-full bg-white/30 overflow-hidden">
            <div class="h-2 rounded-full bg-emerald-500 transition-all" style="width: {statProgress(data.stats?.completed, data.stats?.total)}%"></div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Your Tasks (styled like Dashboard task cards) -->
  <Card class="shadow-sm bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-300/40 rounded-2xl">
    <CardHeader class="px-6 pt-6">
      <div class="flex items-center justify-between w-full">
        <CardTitle class="text-indigo-700">Your Tasks</CardTitle>
        <div class="text-sm text-purple-700/80">Showing recent tasks</div>
      </div>
    </CardHeader>
    <CardContent class="p-6">
      {#if !(data.tasks?.length) || data.tasks.length === 0}
        <div class="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <p class="text-lg font-semibold text-indigo-700">No tasks yet</p>
          <p class="mt-2 text-sm text-purple-700/80">Create your first task from the Dashboard.</p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each data.tasks as task}
            <div class={`rounded-xl border-l-4 ${priorityAccent[task.priority] ?? "border-border"} border border-purple-300/40 bg-white/90 p-4 shadow-sm transition-transform hover:translate-y-[-3px] hover:shadow-xl`}>
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <h3 class="font-semibold text-indigo-700">{task.title}</h3>
                    <Badge variant={task.status === "Completed" ? "success" : task.status === "In Progress" ? "warning" : "secondary"}>
                      {task.status}
                    </Badge>
                  </div>

                  {#if task.description}
                    <p class="mt-1 text-sm text-purple-700/70 line-clamp-2">{task.description}</p>
                  {/if}

                  <div class="mt-2 flex flex-wrap gap-3 text-xs text-purple-700/80">
                    <span class="rounded-full bg-muted px-3 py-1 font-medium text-foreground">{task.priority}</span>
                    <span>Due {formatDate(task.dueDate)}</span>
                    <span>Created {formatDate(task.createdAt)}</span>
                  </div>
                </div>

                <!-- small visual only (actions are on Dashboard) -->
                <div class="flex items-center gap-2">
                  <span class="text-xs text-purple-700/70">•</span>
                  <span class="text-xs text-purple-700/70">{formatDate(task.dueDate)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </CardContent>
  </Card>
</section>
