import ChatMode from "@/components/chat/ChatInput";
import { useParams } from "react-router";

export default function ChatPage() {
	const { id } = useParams<{ id: string }>();

	return (
		<div className="flex h-screen w-full items-center justify-center relative">
			<div className="w-full max-w-4xl px-4">
				<ChatMode conversationId={Number(id)} />
			</div>
		</div>
	);
}
