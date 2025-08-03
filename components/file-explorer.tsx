import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCallback, useMemo, useState } from "react";
import Hint from "@/modules/projects/ui/components/hint";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { CodeView } from "@/components/code-view/Index";
import TreeView from "@/components/TreeView";
import { convertFilesToTreeItems } from "@/lib/utils";

type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface FileExplorerProps {
  files: FileCollection;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files],
  );
  return (
    <ResizablePanelGroup direction={"horizontal"}>
      <ResizablePanel defaultSize={30} minSize={30} className={"bg-sidebar"}>
        <TreeView
          onSelect={handleFileSelect}
          data={treeData}
          value={selectedFile}
        />
      </ResizablePanel>
      <ResizableHandle className={"hover:bg-primary transition-colors"} />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className={"h-full w-full flex flex-col"}>
            <div
              className={
                "border-b bg-sidebar px-4 py-2 flex justify-between items-center "
              }
            >
              {/*TODO FILE BREADCRUMB*/}
              <Hint text={"copy to clipboard"} side={"bottom"}>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className={"ml-auto"}
                  onClick={() => {}}
                  disabled={false}
                >
                  <CopyIcon />
                </Button>
              </Hint>
            </div>
            <div className={"flex-1 overflow-auto"}>
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div
            className={
              "flex h-full items-center justify-center text-muted-foreground"
            }
          >
            Select a file to view it&apos;s contents.
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
