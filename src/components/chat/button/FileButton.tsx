import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { fileService } from "@/services/file.service";
import {
	ArchiveRestore,
	FolderCog,
	Plus,
	Upload,
	X,
	Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArchiveDialog } from "./dialog/ArchiveDialog";

interface FileButtonProps {
	conversationId?: number;
}

export function FileButton({ conversationId }: FileButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [open, setOpen] = useState(false);
	const [archiveOpen, setArchiveOpen] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		if (selectedFiles.length > 0) {
			setFiles((prev) => [...prev, ...selectedFiles]);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleUpload = async () => {
		if (files.length === 0) return;
		setIsUploading(true);
		try {
			const formData = new FormData();
			files.forEach((file) => formData.append("files", file));

			if (!conversationId) {
				console.warn("Chưa có conversationId");
				return;
			}

			const res = await fileService.uploadFiles(conversationId, formData);
			// Upload thành công
			setFiles([]);
			setOpen(false);
			toast.success(
				`Đã upload ${res.length} file: ${res.map((f: { file_name: string }) => f.file_name).join(", ")}`,
			);
		} catch (err) {
			console.error(err);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<>
			<Popover
				open={open}
				onOpenChange={(o) => {
					// Không đóng popover khi file dialog đang mở
					if (!o && isUploading) return;
					setOpen(o);
				}}
			>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="icon">
						<Plus />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-72">
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium">Upload config</p>
							<Button variant="ghost" size="icon" className="h-6 w-6">
								<FolderCog className="h-3 w-3" />
							</Button>
						</div>

						<div className="flex flex-col gap-1">
							<Button
								variant="ghost"
								size="sm"
								className="justify-start"
								onClick={() => fileInputRef.current?.click()}
							>
								<Upload className="mr-2 h-4 w-4" />
								Upload from computer
							</Button>
							<Input
								ref={fileInputRef}
								type="file"
								multiple
								className="hidden"
								onChange={handleFileChange}
								accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
							/>
							<Button
								variant="ghost"
								size="sm"
								className="justify-start"
								onClick={() => setArchiveOpen(true)}
							>
								<ArchiveRestore className="mr-2 h-4 w-4" />
								Add from local archive
							</Button>
						</div>

						{/* Danh sách file đã chọn */}
						{files.length > 0 && (
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground">
									{files.length} file đã chọn
								</p>
								<div className="max-h-32 overflow-y-auto space-y-1">
									{files.map((file, i) => (
										<div
											key={i}
											className="flex items-center justify-between text-xs bg-muted rounded px-2 py-1"
										>
											<span className="truncate max-w-45">{file.name}</span>
											<button
												onClick={() => removeFile(i)}
												className="ml-1 text-muted-foreground hover:text-foreground"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									))}
								</div>
								<Button
									size="sm"
									className="w-full mt-1"
									onClick={handleUpload}
									disabled={isUploading}
								>
									{isUploading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải
											file lên...
										</>
									) : (
										<>Upload {files.length} file</>
									)}
								</Button>
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>
			<ArchiveDialog
				open={archiveOpen}
				onOpenChange={setArchiveOpen}
				conversationId={conversationId!}
			/>
		</>
	);
}
