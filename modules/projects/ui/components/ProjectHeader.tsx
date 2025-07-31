import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface Props {
  projectId: string;
}

const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { setTheme, theme } = useTheme();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId }),
  );
  return (
    <header className={"p-2 flex justify-between items-center border-b"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"sm"}
            className={
              "focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!"
            }
          >
            <Image
              src={"/logo.svg"}
              alt={"clarna"}
              width={18}
              height={18}
              className={""}
            />
            <span className={"text-sm font-medium"}>{project.name}</span>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={"/"} className={"flex items-center"}>
              <ChevronLeftIcon />
              <span>Go to Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className={"gap-2"}>
              <SunMoonIcon className={"size-4 text-muted-foreground"} />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    <span>Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <span>Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <span>System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      Header
    </header>
  );
};

export default ProjectHeader;
