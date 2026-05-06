import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoaderCircle, Trash2, AlertTriangle, Clock } from "lucide-react"
import { useState } from "react"
import { fileService } from "@/services/file.service"
import { toast } from "sonner"
import { useClearHistory } from "@/hooks/use-chat"

export function CleanerUsage({ convId }: { convId: number }) {
	const [isOpen, setIsOpen] = useState(false)
	const [isDeletingFiles, setIsDeletingFiles] = useState(false)

	const clearHistoryMutation = useClearHistory()

	const [confirmDialog, setConfirmDialog] = useState<{
		isOpen: boolean
		type: "files" | "history" | null
	}>({
		isOpen: false,
		type: null,
	})

	// ---------------- FILES ----------------
	const handleDeleteFiles = async () => {
		setIsDeletingFiles(true)
		try {
			await fileService.clearFiles(convId)
			toast.success("Xóa file thành công")

			setIsOpen(false)
		} catch (error) {
			console.error("Lỗi khi xóa file:", error)
			toast.error("Lỗi khi xóa file")
		} finally {
			setIsDeletingFiles(false)
			setConfirmDialog({ isOpen: false, type: null })
		}
	}

	// ---------------- HISTORY ----------------
	const handleDeleteHistory = async () => {
		try {
			await clearHistoryMutation.mutateAsync(convId)

			toast.success("Xóa lịch sử chat thành công")

			setIsOpen(false)
		} catch (error) {
			console.error("Lỗi khi xóa lịch sử:", error)
			toast.error("Xóa lịch sử chat thất bại")
		} finally {
			setConfirmDialog({ isOpen: false, type: null })
		}
	}

	// ---------------- OPEN CONFIRM ----------------
	const openConfirmDialog = (type: "files" | "history") => {
		setConfirmDialog({
			isOpen: true,
			type,
		})
	}

	// ---------------- CONFIRM ----------------
	const handleConfirm = () => {
		if (confirmDialog.type === "files") {
			handleDeleteFiles()
		} else if (confirmDialog.type === "history") {
			handleDeleteHistory()
		}
	}

	const isLoading =
		isDeletingFiles || clearHistoryMutation.isPending

	// ---------------- UI ----------------
	return (
		<>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="icon">
						<LoaderCircle />
					</Button>
				</PopoverTrigger>

				<PopoverContent align="start" className="w-80">
					<PopoverHeader>
						<PopoverTitle>Dọn rác</PopoverTitle>
						<PopoverDescription>
							Xóa file và lịch sử chat để giải phóng dung lượng
						</PopoverDescription>
					</PopoverHeader>

					<div className="mt-4 space-y-3">
						{/* FILES */}
						<Button
							variant="outline"
							className="w-full justify-start gap-2 text-destructive hover:text-destructive cursor-pointer"
							onClick={() => openConfirmDialog("files")}
							disabled={isLoading}
						>
							{isDeletingFiles ? (
								<LoaderCircle className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
							Xóa tất cả file
						</Button>

						{/* HISTORY */}
						<Button
							variant="outline"
							className="w-full justify-start gap-2 text-destructive hover:text-destructive cursor-pointer"
							onClick={() => openConfirmDialog("history")}
							disabled={isLoading}
						>
							{clearHistoryMutation.isPending ? (
								<LoaderCircle className="h-4 w-4 animate-spin" />
							) : (
								<Clock className="h-4 w-4" />
							)}
							Xóa lịch sử chat
						</Button>

						{/* WARNING */}
						<div className="mt-3 rounded-md bg-yellow-50 p-3 dark:bg-yellow-950/20">
							<div className="flex gap-2">
								<AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
								<p className="text-xs text-yellow-700 dark:text-yellow-400">
									Hành động này không thể hoàn tác. Dữ liệu đã xóa sẽ không thể khôi phục.
								</p>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>

			{/* CONFIRM DIALOG */}
			<AlertDialog
				open={confirmDialog.isOpen}
				onOpenChange={(open) =>
					setConfirmDialog((prev) => ({
						...prev,
						isOpen: open,
					}))
				}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{confirmDialog.type === "files"
								? "Xóa tất cả file?"
								: "Xóa lịch sử chat?"}
						</AlertDialogTitle>

						<AlertDialogDescription>
							{confirmDialog.type === "files"
								? "Bạn có chắc chắn muốn xóa tất cả file? Hành động này không thể hoàn tác."
								: "Bạn có chắc chắn muốn xóa lịch sử chat? Hành động này không thể hoàn tác."}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>

						<Button
							onClick={handleConfirm}
							disabled={isLoading}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isLoading ? (
								<LoaderCircle className="h-4 w-4 animate-spin" />
							) : (
								"Xóa"
							)}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}