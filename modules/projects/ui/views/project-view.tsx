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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { FileExplorer } from "@/components/file-explorer";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [isactivefragment, setIsactivefragment] = useState<Fragment | null>(
    null,
  );
  const [tabstate, setTabstate] = useState<"preview" | "code">("preview");
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
          <Tabs
            className={"h-full gap-y-0"}
            defaultValue={"preview"}
            value={tabstate}
            onValueChange={(value) => setTabstate(value as "preview" | "code")}
          >
            <div className={"w-full flex items-center p-2 border-b gap-x-2"}>
              <TabsList className={"h-8 p-0 border rounded-md"}>
                <TabsTrigger value={"preview"} className={"rounded-md"}>
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value={"code"} className={"rounded-md"}>
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className={"ml-auto flex items-center gap-x-2"}>
                <Button asChild size={"sm"} variant={"default"}>
                  <Link href={"/pricing"}>
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value={"preview"}>
              {!!isactivefragment && <FragmentWeb data={isactivefragment} />}
            </TabsContent>
            <TabsContent value={"code"} className={"min-h-0"}>
              {!!isactivefragment?.files && (
                <FileExplorer
                  files={isactivefragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
