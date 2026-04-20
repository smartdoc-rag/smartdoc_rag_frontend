import ChatMode from "@/components/chat/ChatInput";
import { useGetConvById } from "@/hooks/use-conversation";
import { useParams } from "react-router";

export default function ChatPage() {
	const { id } = useParams<{ id: string }>();

	const convId = id ? Number(id) : undefined;

	const { data: conversation } = useGetConvById(convId);

	if (!conversation) return;


	return (
		<div className="flex h-screen w-full items-center justify-center relative">
			<div className="w-full max-w-4xl px-4">
				<ChatMode conversation={conversation} />
			</div>
		</div>
	);
}
