<script module>
  import { Dialog as DialogPrimitive } from "bits-ui";

  export const Dialog = DialogPrimitive.Root;
  export const DialogTrigger = DialogPrimitive.Trigger;
  export const DialogPortal = DialogPrimitive.Portal;
  export const DialogClose = DialogPrimitive.Close;
  export const DialogTitle = DialogPrimitive.Title;
  export const DialogDescription = DialogPrimitive.Description;
</script>

<script>
  import { Dialog as DialogPrimitiveRoot } from "bits-ui";
  import { cn } from "$lib/utils";

  let { class: className = "", children, ...rest } = $props();
</script>

<DialogPrimitiveRoot.Content
  {...rest}
  class={cn(
    "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
    className
  )}
>
  {@render children?.()}
</DialogPrimitiveRoot.Content>
