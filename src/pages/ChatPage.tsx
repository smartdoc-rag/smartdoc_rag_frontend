import ChatMode from "@/components/chat/ChatInput";
import ChatBoard from "@/components/chat/ChatBoard";
import { useGetConvById } from "@/hooks/use-conversation";
import { useParams } from "react-router";
import { useEffect, useRef } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useAsk, useGetHistory } from "@/hooks/use-chat";
import type { AskParams } from "@/types/chat.type";

export default function ChatPage() {
	const { id } = useParams<{ id: string }>();
	const convId = id ? Number(id) : undefined;

	const { data: conversation } = useGetConvById(convId);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { open } = useSidebar();

	const { data: messages } = useGetHistory(convId)
	const { mutate } = useAsk(convId)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	if (!conversation || !messages) return null;

	return (
		<div className="min-h-screen w-full">
			{/* Chat Board */}
			<div
				className={`
				pb-50 transition-all duration-300
			`}
			>
				<div className="max-w-5xl mx-auto w-full px-4">
					<ChatBoard messages={messages} />
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input fixed bottom */}
			<div
				className={`
				fixed bottom-0 right-0 bg-background border-t
				${open ? "md:left-65" : "md:left-0"}
				left-0
			`}
			>
				<div className="max-w-4xl mx-auto w-full px-4 py-4">
					<ChatMode
						conversation={conversation}
						onSendMessage={(param: AskParams) => mutate(param)}
					/>
				</div>
			</div>
		</div>
	);
}