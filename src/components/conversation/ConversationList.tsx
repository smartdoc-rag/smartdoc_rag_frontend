import { useGetConversations } from "@/hooks/use-conversation";
import { SidebarMenuItem } from "../ui/sidebar";
import ConversationCard from "./ConversationCard";
import RenameConvDialog from "./RenameConvDialog";
import { useEffect, useRef, useState } from "react";
import type { Conversation } from "@/types/conversation.type";
import DeleteDialog from "./DeleteConvDialog";
import { ConversationSkeleton } from "./ConversationSkeleton";

interface Props {
	active: string;
	setActive: (id: string) => void;
}

export default function ConversationList({ active, setActive }: Props) {
	const [deletingConv, setDeletingConv] = useState<Conversation | null>(null);
	const [renamingConv, setRenamingConv] = useState<Conversation | null>(null);

	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useGetConversations();

	const conversations = Array.from(
		new Map(
			(data?.pages ?? [])
				.flatMap((p) => p.items)
				.map((item) => [item.id, item])
		).values()
	)

	useEffect(() => {
		const el = loadMoreRef.current;
		if (!el) return;

		const observer = new IntersectionObserver((entries) => {
			const entry = entries[0];

			if (
				entry.isIntersecting &&
				hasNextPage &&
				!isFetchingNextPage
			) {
				fetchNextPage();
			}
		});

		observer.observe(el);

		return () => {
			observer.unobserve(el);
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isLoading) {
		return <ConversationSkeleton />
	}

	return (
		<>
			<SidebarMenuItem className="ml-2">
				{conversations.map((conv) => {
					const path = `/c/${conv.id}`;

					return (
						<ConversationCard
							key={conv.id}
							conv={conv}
							isActive={active === path}
							setDeleting={setDeletingConv}
							setRenaming={setRenamingConv}
							onClick={() => setActive(path)}
						/>
					);
				})}

				<div ref={loadMoreRef} />

				{isFetchingNextPage && (
					<ConversationSkeleton />
				)}
			</SidebarMenuItem>

			<RenameConvDialog
				key={renamingConv?.id}
				conv={renamingConv}
				onClose={() => setRenamingConv(null)}
				open={!!renamingConv}
			/>

			<DeleteDialog
				key={deletingConv?.id}
				conv={deletingConv}
				onClose={() => setDeletingConv(null)}
				open={!!deletingConv}
			/>
		</>
	);
}