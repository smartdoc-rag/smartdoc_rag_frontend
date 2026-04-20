import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Card } from "../ui/card";
import { ChatConfig, type ChatConfigType } from "./button/ChatConfig";
import { ContextUsage } from "./button/ContextUsage";
import { FileButton } from "./button/FileButton";

interface ChatModeProps {
	onSendMessage?: (message: string) => void;
}

export default function ChatMode({ onSendMessage }: ChatModeProps) {
	const [query, setQuery] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [chatConfig, setChatConfig] = useState<ChatConfigType>({
		mode: "rag",
		model: "qwen3.5",
	});

	const handleConfigChange = (newConfig: ChatConfigType) => {
		setChatConfig(newConfig);
		// Xử lý thêm: lưu localStorage, gọi API, thay đổi hành vi gửi tin nhắn, v.v.
		console.log("Config changed:", newConfig);
	};

	// Auto focus
	useEffect(() => {
		textareaRef.current?.focus();
	}, []);

	// Auto resize textarea
	const handleInput = () => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = el.scrollHeight + "px";
	};

	const handleSend = () => {
		if (!query.trim()) return;

		onSendMessage?.(query);
		console.log("Send query:", query);
		setQuery("");

		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
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
			<div className="flex items-center justify-between pb-3">
				<div className="flex items-center gap-1">
					<FileButton />
					<ChatConfig onConfigChange={handleConfigChange} />
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
