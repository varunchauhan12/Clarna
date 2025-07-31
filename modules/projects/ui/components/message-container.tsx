"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageCard from "@/modules/projects/ui/components/message-card";
import Message_form from "@/modules/projects/ui/components/Message_form";
import { useEffect, useRef } from "react";
import { Fragment } from "@/lib/generated/prisma";
import { MessageLoading } from "@/modules/projects/ui/components/message-loading";
interface Props {
  projectId: string;
  isactivefragment: Fragment | null;
  setisactivefragment: (fragment: Fragment | null) => void;
}

const MessageContainer = ({
  projectId,
  isactivefragment,
  setisactivefragment,
}: Props) => {
  const trpc = useTRPC();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId: projectId },
      { refetchInterval: 5000 },
    ),
  );

  useEffect(() => {
    const findLastMessagewithfragment = messages.findLast(
      (message) => message.role === "ASSISTANT" && !!message.Fragment,
    );
    if (findLastMessagewithfragment) {
      setisactivefragment(findLastMessagewithfragment.Fragment || null);
    }
  }, [messages, setisactivefragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const lastmessage = messages[messages.length - 1];
  const lastmessageuser = lastmessage?.role === "USER";

  return (
    <div className={"flex flex-col min-h-0 flex-1"}>
      <div className={"flex-1 min-h-0  overflow-y-auto"}>
        <div className={"pt-2 pr-1"}>
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.Fragment}
              createdAt={message.createdAt}
              isActiveFragment={isactivefragment?.id === message.Fragment?.id}
              onFragmentClick={() => setisactivefragment(message.Fragment)}
              type={message.type}
            />
          ))}
          {lastmessageuser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className={"relative p-3 pt-1"}>
        <div
          className={
            "absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none"
          }
        />
        <Message_form projectId={projectId} />
      </div>
    </div>
  );
};

export default MessageContainer;
