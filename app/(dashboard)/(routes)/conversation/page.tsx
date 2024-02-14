import Heading from "@/components/Heading";
import { MessageSquare } from "lucide-react";

const ConversationPage = () => {
  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      ></Heading>
    </div>
  );
};

export default ConversationPage;