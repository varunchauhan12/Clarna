"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const { data } = useQuery(trpc.messages.getMany.queryOptions());
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        toast.success("Project created successfully");
        router.push(`/project/${data.id}`);
      },
    }),
  );

  return (
    <div className={"p-4 mx-auto"}>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        disabled={createProject.isPending}
        onClick={() => createProject.mutate({ value: value })}
      >
        Invoke inngest
      </Button>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}
