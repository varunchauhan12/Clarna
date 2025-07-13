'use client';

import {Button} from "@/components/ui/button";
import {useTRPC} from "@/trpc/client";
import {useMutation} from "@tanstack/react-query";


export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));


  return (
    <div className={'p-4 mx-auto'}>
      <Button onClick={()=>invoke.mutate({text : "hello world"})}>Invoke inngest</Button>
    </div>
  );
}
