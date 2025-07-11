import {getQueryClient , trpc } from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import Client from "@/app/Client";
import {Suspense} from "react";


export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({text : "hello from the prefetch"}))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
      <Client />
      </Suspense>
    </HydrationBoundary>
  );
}
