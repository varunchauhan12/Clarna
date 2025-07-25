import { Card } from "@/components/ui/card";

interface userMessageProps {
  content: string;
}

const UserMessage = ({ content }: userMessageProps) => {
  return (
    <div className={"flex justify-end pb-4 pr-2 pl-10"}>
      <Card
        className={
          "rounded-lg border-none shadow-none bg-muted p-3 max-w-[80%] break-words"
        }
      >
        {content}
      </Card>
    </div>
  );
};

export default UserMessage;
