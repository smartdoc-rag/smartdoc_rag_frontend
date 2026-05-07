import ChatMode from "@/components/chat/ChatInput";
import ChatBoard from "@/components/chat/ChatBoard";
import { useGetConvById } from "@/hooks/use-conversation";
import { useParams } from "react-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAsk, useGetHistory } from "@/hooks/use-chat";
import type { AskParams } from "@/types/chat.type";
import LoadingInitMessages from "@/components/chat/LoadingInitMessage";
import LoadingPrevMessage from "@/components/chat/LoadingMessage";

export default function ChatPage() {
	const { id } = useParams<{ id: string }>();
	const convId = id ? Number(id) : undefined;

	const { data: conversation } = useGetConvById(convId);
	const { mutate, isPending } = useAsk(convId);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const prevHeightRef = useRef(0);
	const didInitialScroll = useRef(false);

	const {
		data: history,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useGetHistory(convId);

	const handleFetchMore = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		prevHeightRef.current = container.scrollHeight;
		fetchNextPage();
	}, [fetchNextPage]);

	// first init : scroll xuống bottom
	useEffect(() => {
		if (!history || didInitialScroll.current) return;

		messagesEndRef.current?.scrollIntoView({
			behavior: "auto",
		});

		didInitialScroll.current = true;
	}, [history]);

	// lazy load
	useEffect(() => {
		if (isPending) return;
		const el = loadMoreRef.current;
		if (!el) return;

		const observer = new IntersectionObserver((entries) => {
			const entry = entries[0];

			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
				handleFetchMore();
			}
		});

		observer.observe(el);

		return () => {
			observer.unobserve(el);
		};
	}, [handleFetchMore, hasNextPage, isFetchingNextPage, isPending]);

	// giữ scroll ở vị trí hiện tại
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const newHeight = container.scrollHeight;
		const diff = newHeight - prevHeightRef.current;

		if (diff > 0) {
			container.scrollTop += diff;
		}
	}, [history]);

	// data
	const messages = useMemo(() => {
		if (!history) return [];

		return Array.from(
			new Map(
				history.pages
					.flatMap((p) => p.items)
					.reverse()
					.map((item) => [item.tempId || item.request_id, item]),
			).values(),
		);
	}, [history]);
	if (!conversation) return null;

	if (isLoading) {
		return <LoadingInitMessages />;
	}

	return (
		<div className="h-full flex flex-col">
			{/* Chat Board - scrollable area */}
			<div
				ref={containerRef}
				className="flex-1 overflow-y-auto custom-scrollbar min-h-0"
			>
				<div className="max-w-5xl mx-auto w-full px-4 py-6">
					{isFetchingNextPage && <LoadingPrevMessage />}
					<div ref={loadMoreRef} />
					<ChatBoard historyMessages={messages} />
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input - not fixed, just at bottom of flex */}
			<div className="shrink-0 bg-background border-t">
				<div className="max-w-4xl mx-auto w-full px-4 py-4">
					<ChatMode
						conversation={conversation}
						onSendMessage={(param: AskParams) => mutate(param)}
						isPending={isPending}
					/>
				</div>
			</div>
		</div>
	);
}
