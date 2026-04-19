// DeleteDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/conversation.type";
import { useDeleteConv } from "@/hooks/use-conversation";
import { toast } from "sonner";

interface DeleteDialogProps {
    conv: Conversation | null
    open: boolean;
    onClose: () => void
}

export default function DeleteDialog({ conv, open, onClose }: DeleteDialogProps) {

    const { mutate, isPending } = useDeleteConv()

    const handleDelete = () => {
        if (!conv) return;

        mutate(conv.id, {
            onSuccess: (res) => {
                toast.success(res.message)
                onClose()
            },
            onError: (res) => {
                toast.error(res.message)
                onClose()
            }
        })
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            onClose()
        }
    }

    if (!conv) return;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-105">
                <DialogHeader>
                    <DialogTitle>Xóa hội thoại</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p>
                        Bạn có chắc muốn xóa{" "}
                        <strong>{conv.title}</strong> không?
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Hành động này không thể hoàn tác.
                    </p>
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
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        Xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}