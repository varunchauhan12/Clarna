import { Fragment, Role, type } from "@/lib/generated/prisma";
import UserMessage from "@/modules/projects/ui/components/UserMessage";
import AssistentMessage from "@/modules/projects/ui/components/AssistentMessage";

interface CardProps {
  content: string;
  role: Role;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: type;
}

const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: CardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistentMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }
  return <UserMessage content={content} />;
};

export default MessageCard;
