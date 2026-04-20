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

export interface ArchiveFile {
	id: number;
	name: string;
	type: "pdf" | "docx";
	scope: string; // 'private' hoặc 'public'
}

interface ArchiveDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	conversationId: number;
	onConfirm?: (files: ArchiveFile[]) => void;
}

const STORAGE_KEY = "selected_archive_files";

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
	const [files, setFiles] = useState<ArchiveFile[]>([]);
	const [loading, setLoading] = useState(false);

	// Lấy file từ API khi dialog mở
	useEffect(() => {
		if (open && conversationId) {
			const fetchFiles = async () => {
				setLoading(true);
				try {
					const data = await fileService.getFiles(conversationId);
					const archiveFiles: ArchiveFile[] = data
						.filter((f: FileInfo) => {
							const type = getFileType(f.file_type);
							return type !== null;
						})
						.map((f: FileInfo) => ({
							id: f.id,
							name: f.file_name,
							type: getFileType(f.file_type) as "pdf" | "docx",
							scope: f.scope, // 'private' hoặc 'public'
						}));
					setFiles(archiveFiles);
					setSelectedIds(new Set(archiveFiles.map((f) => f.id)));
				} catch (error) {
					console.error("Failed to fetch files:", error);
					toast.error("Không thể tải danh sách file");
				} finally {
					setLoading(false);
				}
			};
			fetchFiles();
		}
	}, [open, conversationId]);

	// Lọc theo search, type, scope
	const filtered = useMemo(() => {
		return files.filter((f) => {
			// Lọc theo scope (private/public)
			if (scopeFilter !== "all" && f.scope !== scopeFilter) return false;

			const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
			const matchType = typeFilter ? f.type === typeFilter.toLowerCase() : true;
			return matchSearch && matchType;
		});
	}, [files, search, typeFilter, scopeFilter]);

	const allSelected =
		filtered.length > 0 && filtered.every((f) => selectedIds.has(f.id));

	const toggleAll = () => {
		if (allSelected) {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				filtered.forEach((f) => next.delete(f.id));
				return next;
			});
		} else {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				filtered.forEach((f) => next.add(f.id));
				return next;
			});
		}
	};

	const toggleFile = (id: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const handleConfirm = () => {
		const selected = files.filter((f) => selectedIds.has(f.id));
		onConfirm?.(selected);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
		onOpenChange(false);
		toast.success(`Đã lưu ${selected.length} file vào kho lưu trữ tạm`);
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
						<div className="px-6 space-y-4">
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
												typeFilter === (t === "PDF" ? "pdf" : "docx")
													? "default"
													: "outline"
											}
											onClick={() => {
												const newType = t === "PDF" ? "pdf" : "docx";
												setTypeFilter(typeFilter === newType ? null : newType);
											}}
										>
											{t}
										</Button>
									))}
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
						<div className="px-6 max-h-80 overflow-y-auto space-y-2 py-3">
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
											{file.scope === "private" ? "Riêng tư" : "Công khai"}
										</p>
									</div>
									{selectedIds.has(file.id) && (
										<div className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground shrink-0">
											<Check className="h-3.5 w-3.5 text-background" />
										</div>
									)}
								</div>
							))}
							{filtered.length === 0 && !loading && (
								<p className="text-center text-sm text-muted-foreground py-8">
									Không tìm thấy file nào
								</p>
							)}
						</div>

						{/* Confirm button */}
						<div className="px-6 py-5 border-t">
							<Button
								className="w-full rounded-full"
								disabled={selectedIds.size === 0}
								onClick={handleConfirm}
							>
								Xác nhận
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
