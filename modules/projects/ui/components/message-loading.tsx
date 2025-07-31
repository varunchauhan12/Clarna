import { useEffect, useState } from "react";
import Image from "next/image";

const Messageview = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating...",
    "Analyzing your request...",
    "Building your website...",
    "Crafting components...",
    "Optimizing layout...",
    "Adding final touches...",
    "Almost ready...",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
      return () => clearInterval(interval);
    }, 2000);
  });

  return (
    <div className={"flex items-center gap-2"}>
      <span className={"text-base text-muted-foreground animate-pulse"}>
        {messages[currentMessage]}
      </span>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className={"flex flex-col px-2 pb-4 group"}>
      <div className={"flex items-center gap-2 pl-2 mb-4"}>
        <Image
          src={"/logo.svg"}
          alt={"Clarna"}
          width={18}
          height={18}
          className={"shrink-0"}
        />
        <span>Clarna</span>
      </div>
      <div className={"pl-8.5 flex flex-col gap-y-4"}>
        <Messageview />
      </div>
    </div>
  );
};
