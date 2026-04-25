import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Card } from "../ui/card";
import { ChatConfig } from "../config/ChatConfig";
import { ContextUsage } from "./button/ContextUsage";
import { FileButton } from "./button/FileButton";
import type { Conversation } from "@/types/conversation.type";
import { useConfigStore } from "@/stores/useConfigStore";
import type { AskParams } from "@/types/chat.type";
import { useUpdateLastChat } from "@/hooks/use-conversation";

interface ChatModeProps {
	onSendMessage: (param: AskParams) => void;
	conversation: Conversation
}

export default function ChatMode({
	onSendMessage,
	conversation,
}: ChatModeProps) {
	const [query, setQuery] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { mutate } = useUpdateLastChat()
	const { mode, searchConfig } = useConfigStore()


	// Auto focus
	useEffect(() => {
		textareaRef.current?.focus();
	}, []);

	const handleInput = () => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = el.scrollHeight + "px";
	};

	const handleSend = () => {
		if (!query.trim()) return;

		const param: AskParams = {
			convId: conversation.id,
			isRerank: searchConfig.includes('rerank'),
			isSelfRag: searchConfig.includes('self-rag'),
			searchType: searchConfig.includes('hybrid') ? 'hybrid' : 'vector',
			responseType: mode,
			question: query,
			selectedFiles: [],
		}

		onSendMessage(param)
		setQuery("");

		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			mutate(conversation.id)
			handleSend();
		}
	};

	return (
		<Card className="bg-card border px-5">
			<textarea
				ref={textareaRef}
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					handleInput();
				}}
				onKeyDown={handleKeyDown}
				placeholder="Nhập câu hỏi... (Enter để gửi, Shift+Enter để xuống dòng)"
				className="
                    w-full resize-none outline-none
                    text-md placeholder:text-muted-foreground
                    max-h-60
                    py-3
                "
				rows={1}
			/>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1">
					<FileButton conversation={conversation} />
					<ChatConfig />
					<ContextUsage />
				</div>
				<Button
					className="cursor-pointer"
					size="icon-lg"
					onClick={handleSend}
					disabled={!query.trim()}
				>
					<ArrowUp />
				</Button>
			</div>
		</Card>
	);
}
