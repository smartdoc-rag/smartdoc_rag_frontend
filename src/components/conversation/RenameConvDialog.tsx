import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUpdateConvTitle } from "@/hooks/use-conversation";
import { toast } from "sonner";
import type { Conversation } from "@/types/conversation.type";

interface RenameDialogProps {
    conv: Conversation | null
    open: boolean;
    onClose: () => void
}

export default function RenameConvDialog({ conv, open, onClose }: RenameDialogProps) {

    const [newTitle, setNewTitle] = useState(conv?.title || '');
    const { mutate, isPending } = useUpdateConvTitle()

    const handleSubmit = () => {
        if (!newTitle || !conv) return;

        if (newTitle.trim() && newTitle !== conv?.title) {
            mutate({
                convId: conv.id,
                newTitle: newTitle,
            }, {
                onSuccess: () => {
                    toast.success("Đổi tên thành công")
                    onClose();
                },
                onError: () => {
                    toast.error("Đổi tên thất bại")
                    onClose();
                }
            })
        }

    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            onClose()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-105">
                <DialogHeader>
                    <DialogTitle>Đổi tên hội thoại</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Nhập tên mới"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit();
                        }}
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Hủy
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        className="cursor-pointer"
                        disabled={isPending}
                    >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}