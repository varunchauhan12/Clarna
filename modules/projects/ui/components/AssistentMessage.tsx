import { Fragment, type } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface AssistentMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: type;
}

const AssistentMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistentMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === "ERROR" && "text-red-700 , dark:text-red-500",
      )}
    >
      <div className={"flex items-center gap-2 pl-2 mb-2"}>
        <Image
          src={"/logo.svg"}
          alt={"logo"}
          width={18}
          height={18}
          className={"shrink-0"}
        />
        <span className={"text-sm font-medium"}>Clarna</span>
        <span
          className={
            "text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          }
        >
          {format(createdAt, "HH:mm 'on' dd.MM.yyyy")}
        </span>
      </div>
      <div className={"pl-8.5 flex flex-col gap-y-4"}>
        <span>{content}</span>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onClickFragment={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

export default AssistentMessage;
