import React, { useState } from "react";
import { Fragment } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, RefreshCcwDot } from "lucide-react";
import Hint from "@/modules/projects/ui/components/hint";

interface Props {
  data: Fragment;
}
const FragmentWeb = ({ data }: Props) => {
  const [fragmentKey, setFragmentKey] = useState(0);

  const [copied, setCopied] = useState(false);
  const onRefresh = () => {
    setFragmentKey((prevKey) => prevKey + 1);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={"w-full h-full flex flex-col"}>
      <div className={"p-2 border-b bg-sidebar flex items-center gap-x-2"}>
        <Hint text={"Refresh sandbox"} side={"bottom"} align={"start"}>
          <Button variant={"outline"} size={"sm"} onClick={onRefresh}>
            <RefreshCcwDot />
          </Button>
        </Hint>
        <Hint side={"bottom"} align={"center"} text={"Copy sandbox URL"}>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className={"flex-1 justify-start text-start font-normal"}
          >
            <span className={"truncate"}>{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint side={"bottom"} align={"end"} text={"Open in new tab"}>
          <Button
            variant={"outline"}
            size={"sm"}
            disabled={!data.sandboxUrl}
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        className={"w-full h-full "}
        sandbox={"allow-forms allow-scripts allow-same-origin"}
        loading={"lazy"}
        src={data.sandboxUrl}
      />
    </div>
  );
};

export default FragmentWeb;
