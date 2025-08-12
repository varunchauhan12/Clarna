"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "@/app/(home)/constants";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: " value is required" })
    .max(10000, { message: " value is too long" }),
});

const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const onselect = (content: string) => {
    form.setValue("value", content, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`/project/${data.id}`);
      },
      onError: (err) => {
        // Redirect to pricing page if specific error
        toast.error(err.message);
      },
    }),
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  const isPending = createProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Form {...form}>
      <section className={"space-y-6"}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all mb-4",
            isFocused && "shadow-xs",
          )}
        >
          <FormField
            control={form.control}
            name={"value"}
            render={({ field }) => (
              <Textarea
                {...field}
                disabled={isPending}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minLength={2}
                maxLength={10000}
                className={
                  "pt-4 bg-none border-none resize-none w-full outline-none bg-transparent"
                }
                placeholder={"What would you like to build?"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className={"flex gap-x-2 items-center justify-between pt-2"}>
            <div className={"text-[10px] text-muted-foreground font-mono "}>
              <kbd
                className={
                  "ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
                }
              >
                <span>&#8984;</span> Enter
              </kbd>
              &nbsp; to submit
            </div>
            <Button
              className={cn(
                "size-8 rounded-full",
                isButtonDisabled && "bg-muted-foreground border  ",
              )}
              disabled={isButtonDisabled}
            >
              {isPending ? (
                <Loader2Icon className={"size-4 animate-spin"} />
              ) : (
                <ArrowUpIcon />
              )}
            </Button>
          </div>
        </form>
        <div
          className={"flex-wrap justify-center gap-2 hidden md:flex max-w-3xl"}
        >
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant={"outline"}
              size={"sm"}
              className={"bg-white dark:bg-sidebar"}
              onClick={() => onselect(template.prompt)}
            >
              {template.emoji} {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
};

export default ProjectForm;
