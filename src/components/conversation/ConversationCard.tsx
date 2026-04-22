import type { Conversation } from "@/types/conversation.type";
import { SidebarMenuButton } from "../ui/sidebar";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface ConversationCardProps {
	conv: Conversation;
	isActive?: boolean;
	onClick?: () => void;
	setDeleting?: (conv: Conversation) => void;
	setRenaming?: (conv: Conversation) => void;
}

export default function ConversationCard({
	conv,
	isActive,
	onClick,
	setDeleting,
	setRenaming,
}: ConversationCardProps) {
	const navigate = useNavigate();

	if (!conv) return null;

	const handleClick = () => {
		onClick?.();
		navigate(`/c/${conv.id}`);
	};

	return (
		<div className="relative group/item my-1.25">
			<SidebarMenuButton
				isActive={isActive}
				onClick={handleClick}
				className="
                    pr-8
                    cursor-pointer
                    transition-colors
                    group-hover/item:bg-sidebar-accent
                    group-hover/item:text-sidebar-accent-foreground
                "
			>
				<span className="flex-1 truncate">{conv.title}</span>
			</SidebarMenuButton>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="
                            absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6
                            cursor-pointer
                            opacity-0
                            group-hover/item:opacity-100
                            data-[state=open]:opacity-100
                            transition-opacity
                            z-10
                        "
						onClick={(e) => e.stopPropagation()}
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-32">
					<DropdownMenuItem onClick={() => setRenaming?.(conv)}>
						<Pencil className="mr-2 h-4 w-4" />
						Đổi tên
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => setDeleting?.(conv)}
						className="text-red-600 focus:text-red-600"
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Xóa
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}