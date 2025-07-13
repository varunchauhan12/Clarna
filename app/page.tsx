'use client';

import {Button} from "@/components/ui/button";
import {useTRPC} from "@/trpc/client";
import {useMutation} from "@tanstack/react-query";
import {Input} from "@/components/ui/input";
import {useState} from "react";


export default function Home() {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));


  return (
    <div className={'p-4 mx-auto'}>
      <Input value={value} onChange={(e) => setValue(e.target.value)}/>
      <Button onClick={()=>invoke.mutate({value: value})}>Invoke inngest</Button>
    </div>
  );
}
