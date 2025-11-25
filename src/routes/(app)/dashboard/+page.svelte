<script>
  // Core SvelteKit imports for client-side functionality
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { goto, invalidateAll } from "$app/navigation";
  
  // UI component imports from shadcn-svelte
  import Badge from "$lib/components/ui/badge.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import Card from "$lib/components/ui/card.svelte";
  import CardContent from "$lib/components/ui/card-content.svelte";
  import CardDescription from "$lib/components/ui/card-description.svelte";
  import CardHeader from "$lib/components/ui/card-header.svelte";
  import CardTitle from "$lib/components/ui/card-title.svelte";
  import Input from "$lib/components/ui/input.svelte";
  import Label from "$lib/components/ui/label.svelte";
  import Textarea from "$lib/components/ui/textarea.svelte";
  import Select from "$lib/components/ui/select.svelte";
  
  // Utility imports
  import { formatDate } from "$lib/utils";
  import { toast } from "svelte-sonner";

  // Props passed from server-side load function
  export let data; // Contains tasks, filters, stats, and user data
  export let form; // Contains form action results (success/error messages)
  
  // Component state variables
  let createPending = false; // Loading state for task creation
  let editPending = false; // Loading state for task editing
  let editingTask = null; // Currently selected task for editing (null = not editing)
  let searchValue = data.filters.query ?? ""; // Search input value
  let createFormEl; // Reference to the create form element for resetting

  // Reactive statement: Show toast notifications based on form action results
  $: if (form?.message) {
    if (form.success) {
      toast.success(form.message);
    } else {
      toast.error(form.message);
    }
  }

  // Select options for priority dropdown
  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  // Select options for status dropdown
  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  /**
   * Apply a filter to the task list by updating URL search params
   * @param {string} key - Filter parameter name (status, priority, sort, q)
   * @param {string} value - Filter value to apply
   */
  const applyFilter = (key, value) => {
    if (!browser) return; // Only run on client-side
    const params = new URLSearchParams(window.location.search);
    if (!value || value === "all") {
      params.delete(key); // Remove filter if "all" is selected
    } else {
      params.set(key, value); // Set the filter value
    }
    // Update URL without page reload, maintaining scroll position
    goto(`/dashboard?${params.toString()}`, { replaceState: true, noScroll: true });
  };

  /**
   * Reset all filters and return to default dashboard view
   */
  const resetFilters = () => {
    if (!browser) return;
    goto("/dashboard", { replaceState: true });
  };

  // Debounce timer for search input to avoid excessive server requests
  let searchTimer;
  
  /**
   * Handle search input with debouncing (400ms delay)
   * @param {Event} event - Input event from search field
   */
  const handleSearchInput = (event) => {
    searchValue = event.currentTarget.value;
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      applyFilter("q", searchValue);
    }, 400); // Wait 400ms after user stops typing before applying filter
  };

  /**
   * Form submission handler for task creation
   * Returns an async callback function for use with SvelteKit's enhance directive
   * Handles success/error states, shows toasts, resets form, and refreshes data
   */
  function handleCreateSubmit() {
    return async ({ result, update }) => {
      createPending = true; // Show loading state
      if (result.type === "success") {
        toast.success("Task created successfully");
        createFormEl?.reset(); // Clear the form inputs
        await invalidateAll(); // Refresh all page data from server
      } else if (result.type === "failure") {
        toast.error(result.data?.message || "Failed to create task");
      }
      await update(); // Apply the form action result
      createPending = false; // Remove loading state
    };
  }

  /**
   * Form submission handler for task editing
   * Similar to handleCreateSubmit but closes the edit modal on success
   */
  function handleEditSubmit() {
    return async ({ result, update }) => {
      editPending = true; // Show loading state
      if (result.type === "success") {
        toast.success("Task updated successfully");
        editingTask = null; // Close the edit modal
        await invalidateAll(); // Refresh all page data from server
      } else if (result.type === "failure") {
        toast.error(result.data?.message || "Failed to update task");
      }
      await update(); // Apply the form action result
      editPending = false; // Remove loading state
    };
  }

  /**
   * Form submission handler for toggling task status (Complete/Reopen)
   * Quick action without modal, just shows toast and refreshes data
   */
  function handleToggleSubmit() {
    return async ({ result, update }) => {
      if (result.type === "success") {
        toast.success("Status updated");
        await invalidateAll(); // Refresh to show updated status
      } else if (result.type === "failure") {
        toast.error(result.data?.message || "Failed to update status");
      }
      await update();
    };
  }

  /**
   * Form submission handler for task deletion
   * Shows confirmation and refreshes data on success
   */
  function handleDeleteSubmit() {
    return async ({ result, update }) => {
      if (result.type === "success") {
        toast.success("Task deleted");
        await invalidateAll(); // Refresh to remove deleted task from list
      } else if (result.type === "failure") {
        toast.error(result.data?.message || "Failed to delete task");
      }
      await update();
    };
  }

  /**
   * Map priority levels to Tailwind border color classes
   * Used to add colored left border to task cards for visual priority indication
   */
  const priorityAccent = {
    High: "border-red-500",
    Medium: "border-amber-400",
    Low: "border-emerald-400",
  };

  // small helper to keep consistent stat progress visuals (simple heuristic)
  const statProgress = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.round((value / total) * 100));
  };
</script>

<!-- Main Dashboard Layout -->
<section class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-indigo-700">Dashboard</h1>
        <p class="text-sm text-purple-700/80 mt-1">Overview of your tasks and progress — quick actions available below.</p>
      </div>
    </div>

    <!-- Stats Overview (refined) -->
    <div class="grid gap-4 md:grid-cols-4 mt-1">
      <Card class="shadow-sm bg-gradient-to-br from-indigo-500/6 via-purple-500/6 to-pink-500/6 border border-purple-300/30 rounded-xl">
        <CardContent class="p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-medium text-purple-700/80 uppercase">Total Tasks</p>
              <p class="text-2xl font-extrabold text-indigo-700 mt-1">{data.stats.total || 0}</p>
              <div class="mt-3 h-2 w-full rounded-full bg-white/30 overflow-hidden">
                <div class="h-2 rounded-full bg-indigo-600 transition-all" style="width: {statProgress(data.stats.completed, data.stats.total)}%"></div>
              </div>
              <p class="mt-2 text-xs text-purple-700/70">{statProgress(data.stats.completed, data.stats.total)}% completed</p>
            </div>
            <div class="rounded-full bg-indigo-100 p-3">
              <svg class="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="shadow-sm bg-gradient-to-br from-indigo-500/6 via-purple-500/6 to-pink-500/6 border border-purple-300/30 rounded-xl">
        <CardContent class="p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-medium text-purple-700/80 uppercase">Pending</p>
              <p class="text-2xl font-extrabold text-indigo-700 mt-1">{data.stats.pending}</p>
              <div class="mt-3 h-2 w-full rounded-full bg-white/30 overflow-hidden">
                <div class="h-2 rounded-full bg-purple-600 transition-all" style="width: {statProgress(data.stats.pending, data.stats.total)}%"></div>
              </div>
            </div>
            <div class="rounded-full bg-purple-100 p-3">
              <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="shadow-sm bg-gradient-to-br from-indigo-500/6 via-purple-500/6 to-pink-500/6 border border-purple-300/30 rounded-xl">
        <CardContent class="p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-medium text-purple-700/80 uppercase">In Progress</p>
              <p class="text-2xl font-extrabold text-indigo-700 mt-1">{data.stats.inProgress}</p>
              <div class="mt-3 h-2 w-full rounded-full bg-white/30 overflow-hidden">
                <div class="h-2 rounded-full bg-amber-500 transition-all" style="width: {statProgress(data.stats.inProgress, data.stats.total)}%"></div>
              </div>
            </div>
            <div class="rounded-full bg-amber-100 p-3">
              <svg class="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="shadow-sm bg-gradient-to-br from-indigo-500/6 via-purple-500/6 to-pink-500/6 border border-purple-300/30 rounded-xl">
        <CardContent class="p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-medium text-purple-700/80 uppercase">Completed</p>
              <p class="text-2xl font-extrabold text-indigo-700 mt-1">{data.stats.completed}</p>
              <div class="mt-3 h-2 w-full rounded-full bg-white/30 overflow-hidden">
                <div class="h-2 rounded-full bg-emerald-500 transition-all" style="width: {statProgress(data.stats.completed, data.stats.total)}%"></div>
              </div>
            </div>
            <div class="rounded-full bg-emerald-100 p-3">
              <svg class="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <!-- Add Task Form (refined) -->
  <Card class="shadow-md bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-300/40 rounded-2xl">
    <CardHeader class="px-6 pt-6">
      <div class="flex items-start justify-between w-full">
        <div>
          <CardTitle class="text-indigo-700">Create New Task</CardTitle>
          <CardDescription class="text-purple-700/80 mt-1">Add a task quickly — required fields first.</CardDescription>
        </div>
        <div class="text-sm text-muted-foreground mt-1">Tip: use clear titles like “Write weekly report”.</div>
      </div>
    </CardHeader>

    <CardContent class="p-6">
      <form 
        bind:this={createFormEl}
        method="POST" 
        action="?/create" 
        class="space-y-4" 
        use:enhance={handleCreateSubmit}
      >
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="title" class="text-indigo-700">Title</Label>
            <Input id="title" name="title" maxlength="100" required placeholder="Enter task title" class="border-purple-400/60 focus:border-indigo-600 focus:ring-indigo-600 bg-white/90 shadow-sm" />
          </div>
          <div class="space-y-2">
            <Label for="priority" class="text-indigo-700">Priority</Label>
            <select 
              id="priority"
              name="priority" 
              required
              class="flex h-10 w-full rounded-md border border-purple-300/60 bg-white/90 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="description" class="text-indigo-700">Description</Label>
          <Textarea id="description" name="description" maxlength="500" placeholder="Enter task description (optional)" class="border-purple-400/60 focus:border-indigo-600 focus:ring-indigo-600 bg-white/90 shadow-sm" />
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="dueDate" class="text-indigo-700">Due date</Label>
            <div class="relative">
              <input 
                type="date" 
                id="dueDate"
                name="dueDate" 
                required
                style="color-scheme: light dark;"
                class="flex h-10 w-full rounded-md border border-purple-300/60 bg-white/90 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 cursor-pointer"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="status" class="text-indigo-700">Status</Label>
            <select 
              id="status"
              name="status"
              class="flex h-10 w-full rounded-md border border-purple-300/60 bg-white/90 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <option value="Pending" selected>Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {#if form?.message && !form?.success}
          <p class="text-sm text-red-600">{form.message}</p>
        {/if}

        <div class="flex gap-3 items-center">
          <Button type="submit" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg" disabled={createPending}>
            {#if createPending}
              Creating…
            {:else}
              Create Task
            {/if}
          </Button>
          <Button type="button" variant="outline" onclick={() => createFormEl?.reset()}>
            Clear
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>

  <!-- Filters Section (compact) -->
  <Card class="shadow-sm bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-300/40 rounded-xl">
    <CardContent class="pt-6 px-6 pb-6">
      <div class="grid gap-3 md:grid-cols-4">
        <Select
          options={[{ value: "all", label: "All statuses" }, ...statusOptions]}
          value={data.filters.status}
          onchange={(event) => applyFilter("status", event.currentTarget.value)}
        />
        <Select
          options={[{ value: "all", label: "All priorities" }, ...priorityOptions]}
          value={data.filters.priority}
          onchange={(event) => applyFilter("priority", event.currentTarget.value)}
        />
        <select
          class="flex h-10 w-full rounded-md border border-purple-300/60 bg-white/90 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          value={data.filters.sort}
          onchange={(event) => applyFilter("sort", event.currentTarget.value)}
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="createdAt">Sort by Created Date</option>
        </select>
        <Input
          placeholder="Search by title..."
          value={searchValue}
          oninput={handleSearchInput}
          class="border-purple-300/60 focus:border-indigo-600 focus:ring-indigo-600 bg-white/90"
        />
      </div>
      <div class="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onclick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </CardContent>
  </Card>

  <!-- Tasks list -->
  <div class="space-y-4">
    {#if data.tasks.length === 0}
      <div class="rounded-xl border border-dashed border-border bg-muted/30 p-16 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-semibold text-indigo-700">No tasks found</h3>
        <p class="mt-2 text-sm text-purple-700/80">Create your first task to get started with managing your work.</p>
      </div>
    {:else}
      <div class="grid gap-4">
        {#each data.tasks as task}
          <Card class={`border-l-4 ${priorityAccent[task.priority] ?? "border-border"} shadow-sm transition-transform hover:translate-y-[-3px] hover:shadow-xl rounded-xl bg-white/90`}>
            <CardContent class="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-indigo-700">{task.title}</h3>
                  <Badge variant={task.status === "Completed" ? "success" : task.status === "In Progress" ? "warning" : "secondary"}>
                    {task.status}
                  </Badge>
                </div>
                {#if task.description}
                  <p class="mt-2 text-sm text-purple-700/70 line-clamp-2">
                    {task.description}
                  </p>
                {/if}
                <div class="mt-3 flex flex-wrap gap-3 text-xs text-purple-700/70 items-center">
                  <span class="inline-flex items-center rounded-full bg-muted px-3 py-1 font-medium text-foreground">
                    {task.priority}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Due {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
              <div class="flex flex-col gap-2 md:flex-row md:items-center">
                <form method="POST" action="?/toggle" use:enhance={handleToggleSubmit}>
                  <input type="hidden" name="id" value={task.id} />
                  <input type="hidden" name="status" value={task.status === "Completed" ? "Pending" : "Completed"} />
                  <Button type="submit" variant="secondary" size="sm" class="bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {task.status === "Completed" ? "Reopen" : "Complete"}
                  </Button>
                </form>
                <Button variant="outline" size="sm" onclick={() => (editingTask = task)}>Edit</Button>
                <form method="POST" action="?/delete" use:enhance={handleDeleteSubmit}>
                  <input type="hidden" name="id" value={task.id} />
                  <Button type="submit" variant="destructive" size="sm">Delete</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</section>

{#if editingTask}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-indigo-700">Edit task</h3>
        <button class="text-sm text-purple-700/80" onclick={() => (editingTask = null)}>Close</button>
      </div>
      <form method="POST" action="?/update" class="mt-4 space-y-4" use:enhance={handleEditSubmit}>
        <input type="hidden" name="id" value={editingTask.id} />
        <div class="space-y-2">
          <Label for="editTitle" class="text-indigo-700">Title</Label>
          <Input id="editTitle" name="title" value={editingTask.title} required maxlength="100" class="border-purple-400/60 focus:border-indigo-600 focus:ring-indigo-600 bg-white/90" />
        </div>
        <div class="space-y-2">
          <Label for="editDescription" class="text-indigo-700">Description</Label>
          <Textarea id="editDescription" name="description" value={editingTask.description} maxlength="500" class="border-purple-400/60 focus:border-indigo-600 focus:ring-indigo-600 bg-white/90" />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="editPriority" class="text-indigo-700">Priority</Label>
            <select 
              id="editPriority"
              name="priority" 
              value={editingTask.priority}
              required
              class="flex h-10 w-full rounded-md border border-purple-300/60 bg-white/90 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="editDueDate" class="text-indigo-700">Due date</Label>
            <div class="relative">
              <input 
                type="date" 
                id="editDueDate"
                name="dueDate" 
                value={editingTask.dueDate?.slice(0, 10)} 
                required
                style="color-scheme: light dark;"
                class="flex h-10 w-full rounded-md border border-purple-300/60 bg-white/90 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="editStatus" class="text-indigo-700">Status</Label>
          <select 
            id="editStatus"
            name="status" 
            value={editingTask.status}
            class="flex h-10 w-full rounded-md border border-purple-300/60 bg-white/90 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <Button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" disabled={editPending}>
          {#if editPending}
            Updating…
          {:else}
            Save changes
          {/if}
        </Button>
      </form>
    </div>
  </div>
{/if}
