import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Fragment, useCallback, useMemo, useState } from "react";
import Hint from "@/modules/projects/ui/components/hint";
import { Button } from "@/components/ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { CodeView } from "@/components/code-view/Index";
import TreeView from "@/components/TreeView";
import { convertFilesToTreeItems } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface FileExplorerProps {
  files: FileCollection;
}

interface FileBreadcrumbProps {
  filePath: string;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  const [iscopied, setIscopied] = useState(false);

  const FileBreadCrunb = ({ filePath }: FileBreadcrumbProps) => {
    const pathSegments = filePath.split("/");
    const maxSegments = 4;

    const renderBreadCrumbItems = () => {
      if (pathSegments.length <= maxSegments) {
        // show all segmetns if 4 or less

        return pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={"font-medium"}>
                    {segment}
                  </BreadcrumbPage>
                ) : (
                  <span className={"text-muted-foreground"}>{segment}</span>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        });
      } else {
        const firstSegment = pathSegments[0];
        const lastSegment = pathSegments[pathSegments.length - 1];

        return (
          <>
            <BreadcrumbItem>
              <span className={"text-muted-foreground"}>{firstSegment}</span>
              <BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className={"font-medium"}>
                  {lastSegment}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbItem>
          </>
        );
      }
    };
    return (
      <Breadcrumb>
        <BreadcrumbList>{renderBreadCrumbItems()}</BreadcrumbList>
      </Breadcrumb>
    );
  };

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

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setIscopied(true);
      setTimeout(() => {
        setIscopied(false);
      }, 2000);
    }
  }, [files, selectedFile]);
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
              <FileBreadCrunb filePath={selectedFile} />
              <Hint text={"copy to clipboard"} side={"bottom"}>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className={"ml-auto"}
                  onClick={handleCopy}
                  disabled={iscopied}
                >
                  {iscopied ? <CopyCheckIcon /> : <CopyIcon />}
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
