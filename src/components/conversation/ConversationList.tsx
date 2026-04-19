import { useGetConversations } from "@/hooks/use-conversation";
import { SidebarGroup, SidebarGroupLabel } from "../ui/sidebar";
import ConversationCard from "./ConversationCard";
import RenameConvDialog from "./RenameConvDialog";
import { useState } from "react";
import type { Conversation } from "@/types/conversation.type";
import DeleteDialog from "./DeleteConvDialog";

interface Props {
    active: string
    setActive: (id: string) => void
}

export default function ConversationList({ active, setActive }: Props) {
    const [deletingConv, setDeletingConv] = useState<Conversation | null>(null)
    const [renamingConv, setRenamingConv] = useState<Conversation | null>(null)

    const { data: conversations } = useGetConversations()

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Lịch sử</SidebarGroupLabel>

                {conversations?.map((conv) => {
                    const path = `/c/${conv.id}`

                    return (
                        <ConversationCard
                            key={conv.id}
                            conv={conv}
                            isActive={active === path}
                            setDeleting={(conv) => setDeletingConv(conv)}
                            setRenaming={(conv) => setRenamingConv(conv)}
                            onClick={() => setActive(path)}
                        />
                    )
                })}
            </SidebarGroup>

            {/* Dialogs */}
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
    )
}