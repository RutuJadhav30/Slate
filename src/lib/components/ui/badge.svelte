<script>
  import { cva } from "class-variance-authority";
  import { cn } from "$lib/utils";

  const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
      variants: {
        variant: {
          default: "border-transparent bg-primary text-primary-foreground",
          secondary: "border-transparent bg-secondary text-secondary-foreground",
          outline: "text-foreground",
          success: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100",
          warning: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100"
        }
      },
      defaultVariants: {
        variant: "default"
      }
    }
  );

  let { variant = "default", class: className = "", children, ...rest } = $props();
</script>

<span {...rest} class={cn(badgeVariants({ variant }), className)}>
  {@render children?.()}
</span>
