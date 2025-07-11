"use client";

import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";

const Client = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.hello.queryOptions({text : "hello from the prefetch"}))
  return (
    <div>
        {JSON.stringify(data)}
    </div>
  );
}

export default Client;