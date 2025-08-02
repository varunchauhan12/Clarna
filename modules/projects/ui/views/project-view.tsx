"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessageContainer from "@/modules/projects/ui/components/message-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/lib/generated/prisma";
import ProjectHeader from "@/modules/projects/ui/components/ProjectHeader";
import FragmentWeb from "@/modules/projects/ui/components/FragmentWeb";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [isactivefragment, setIsactivefragment] = useState<Fragment | null>(
    null,
  );
  return (
    <div className={"h-screen"}>
      <ResizablePanelGroup direction={"horizontal"}>
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className={"flex flex-col min-h-0"}
        >
          <Suspense fallback={<p>Loading Project...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>Loading messages...</p>}>
            <MessageContainer
              projectId={projectId}
              isactivefragment={isactivefragment}
              setisactivefragment={setIsactivefragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          {!!isactivefragment && <FragmentWeb data={isactivefragment} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
