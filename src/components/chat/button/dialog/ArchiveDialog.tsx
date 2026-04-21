// ArchiveDialog.tsx
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Check, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { fileService, type FileInfo } from "@/services/file.service";
import { conversationService } from "@/services/conversation.service";

export interface ArchiveFile {
	id: number;
	name: string;
	type: "pdf" | "docx";
	scope: string;
	uploadedAt: string;
}

interface ArchiveDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	conversationId: number;
	onConfirm?: (files: ArchiveFile[]) => void;
}

const getFileType = (fileType: string): "pdf" | "docx" | null => {
	const lower = fileType.toLowerCase();
	if (lower === "pdf") return "pdf";
	if (lower === "docx") return "docx";
	return null;
};

export function ArchiveDialog({
	open,
	onOpenChange,
	conversationId,
	onConfirm,
}: ArchiveDialogProps) {
	const [search, setSearch] = useState("");
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const [typeFilter, setTypeFilter] = useState<string | null>(null);
	const [scopeFilter, setScopeFilter] = useState<"all" | "private" | "public">(
		"all",
	);
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [files, setFiles] = useState<ArchiveFile[]>([]);
	const [loading, setLoading] = useState(false);
	const [confirming, setConfirming] = useState(false);

	useEffect(() => {
		if (!open || !conversationId) return;

		const fetchData = async () => {
			setLoading(true);
			try {
				const [data, selectedFileIds] = await Promise.all([
					fileService.getFiles(conversationId),
					conversationService.getSelectedFile(conversationId),
				]);

				const archiveFiles: ArchiveFile[] = data
					.filter((f: FileInfo) => getFileType(f.file_type) !== null)
					.map((f: FileInfo) => ({
						id: f.id,
						name: f.file_name,
						type: getFileType(f.file_type) as "pdf" | "docx",
						scope: f.scope,
						uploadedAt: f.file_uploaded_at,
					}));

				setFiles(archiveFiles);

				if (selectedFileIds.length > 0) {
					setSelectedIds(new Set(selectedFileIds));
				} else {
					setSelectedIds(new Set(archiveFiles.map((f) => f.id)));
				}
			} catch (error) {
				console.error("Failed to fetch files:", error);
				toast.error("Không thể tải danh sách file");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [open, conversationId]);

	const filtered = useMemo(() => {
		return files.filter((f) => {
			if (scopeFilter !== "all" && f.scope !== scopeFilter) return false;

			const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
			const matchType = typeFilter ? f.type === typeFilter : true;

			// So sánh ngày an toàn dùng chuỗi YYYY-MM-DD
			const uploadedDateStr = f.uploadedAt.split("T")[0];
			const matchFrom = dateFrom ? uploadedDateStr >= dateFrom : true;
			const matchTo = dateTo ? uploadedDateStr <= dateTo : true;

			return matchSearch && matchType && matchFrom && matchTo;
		});
	}, [files, search, typeFilter, scopeFilter, dateFrom, dateTo]);

	const allSelected =
		filtered.length > 0 && filtered.every((f) => selectedIds.has(f.id));

	const toggleAll = () => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (allSelected) {
				filtered.forEach((f) => next.delete(f.id));
			} else {
				filtered.forEach((f) => next.add(f.id));
			}
			return next;
		});
	};

	const toggleFile = (id: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const handleConfirm = async () => {
		setConfirming(true);
		try {
			const selectedFileIds = Array.from(selectedIds);
			await conversationService.setSelectedFile(
				conversationId,
				selectedFileIds,
			);
			const selected = files.filter((f) => selectedIds.has(f.id));
			onConfirm?.(selected);
			onOpenChange(false);
			toast.success(`Đã lưu ${selected.length} file`);
		} catch (error) {
			console.error("Failed to save selected files:", error);
			toast.error("Không thể lưu danh sách file");
		} finally {
			setConfirming(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
				<DialogHeader className="px-6 pt-6 pb-2">
					<DialogTitle className="text-xl font-semibold">
						Chọn file từ kho lưu trữ
					</DialogTitle>
				</DialogHeader>

				{loading ? (
					<div className="flex justify-center items-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<>
						<div className="px-6 space-y-3 pt-2">
							{/* Search + Type filter */}
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Tìm kiếm file..."
										className="pl-9"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
									/>
								</div>
								<div className="flex gap-2">
									{["PDF", "DOCX"].map((t) => (
										<Button
											key={t}
											variant={
												typeFilter === t.toLowerCase() ? "default" : "outline"
											}
											onClick={() => {
												const newType = t.toLowerCase();
												setTypeFilter(typeFilter === newType ? null : newType);
											}}
										>
											{t}
										</Button>
									))}
								</div>
							</div>

							{/* Date range filter - FIXED LAYOUT */}
							<div className="space-y-2">
								<div className="grid grid-cols-1 sm:grid-cols-[auto,1fr,auto,1fr,auto] items-center gap-2">
									<span className="text-sm text-muted-foreground whitespace-nowrap">
										Từ ngày:
									</span>
									<Input
										type="date"
										className="w-full"
										value={dateFrom}
										max={dateTo || undefined}
										onChange={(e) => setDateFrom(e.target.value)}
									/>
									<span className="text-sm text-muted-foreground whitespace-nowrap">
										Đến ngày:
									</span>
									<Input
										type="date"
										className="w-full"
										value={dateTo}
										min={dateFrom || undefined}
										onChange={(e) => setDateTo(e.target.value)}
									/>
									{(dateFrom || dateTo) && (
										<Button
											variant="ghost"
											size="sm"
											className="shrink-0"
											onClick={() => {
												setDateFrom("");
												setDateTo("");
											}}
										>
											Xóa
										</Button>
									)}
								</div>
							</div>

							{/* Scope filter */}
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-sm text-muted-foreground">Phạm vi:</span>
								{[
									{ label: "Tất cả", value: "all" },
									{ label: "Riêng tư", value: "private" },
									{ label: "Công khai", value: "public" },
								].map((opt) => (
									<Button
										key={opt.value}
										variant={scopeFilter === opt.value ? "default" : "outline"}
										size="sm"
										onClick={() => setScopeFilter(opt.value as any)}
									>
										{opt.label}
									</Button>
								))}
							</div>

							{/* Select all */}
							<div className="flex items-center justify-between py-1">
								<label className="flex items-center gap-2 text-sm cursor-pointer select-none">
									<input
										type="checkbox"
										checked={allSelected}
										onChange={toggleAll}
										className="h-4 w-4 rounded"
									/>
									Tất cả ({filtered.length})
								</label>
								<span className="text-sm text-muted-foreground">
									Đã chọn ({selectedIds.size})
								</span>
							</div>
						</div>

						{/* Danh sách file */}
						<div className="px-6 max-h-72 overflow-y-auto space-y-2 py-3">
							{filtered.map((file) => (
								<div
									key={file.id}
									onClick={() => toggleFile(file.id)}
									className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 shrink-0">
										<FileText className="h-5 w-5 text-red-500" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{file.name}</p>
										<p className="text-xs text-muted-foreground">
											{file.type.toUpperCase()} •{" "}
											{file.scope === "private" ? "Riêng tư" : "Công khai"} •{" "}
											{new Date(file.uploadedAt).toLocaleDateString("vi-VN")}
										</p>
									</div>
									{selectedIds.has(file.id) && (
										<div className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground shrink-0">
											<Check className="h-3.5 w-3.5 text-background" />
										</div>
									)}
								</div>
							))}
							{filtered.length === 0 && (
								<p className="text-center text-sm text-muted-foreground py-8">
									Không tìm thấy file nào
								</p>
							)}
						</div>

						{/* Confirm button */}
						<div className="px-6 py-5 border-t">
							<Button
								className="w-full rounded-full"
								disabled={selectedIds.size === 0 || confirming}
								onClick={handleConfirm}
							>
								{confirming && (
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
								)}
								Xác nhận
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
