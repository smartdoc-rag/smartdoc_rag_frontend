import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const SIZE_OPTIONS = [500, 1000, 1500, 2000];
const OVERLAP_OPTIONS = [50, 100, 150, 200];

interface ChunkConfigDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialSize?: number;
	initialOverlap?: number;
	onSave?: (size: number, overlap: number) => void;
	modal: boolean;
}

export function ChunkConfigDialog({
	open,
	onOpenChange,
	initialSize = 1500,
	initialOverlap = 200,
	onSave,
	modal = true,
}: ChunkConfigDialogProps) {
	const [chunkSize, setChunkSize] = useState(initialSize);
	const [chunkOverlap, setChunkOverlap] = useState(initialOverlap);

	useEffect(() => {
		if (open) {
			setChunkSize(initialSize);
			setChunkOverlap(initialOverlap);
		}
	}, [open, initialSize, initialOverlap]);

	const snapToOptions = (value: number, options: number[]) => {
		return options.reduce((prev, curr) =>
			Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
		);
	};

	const handleSizeChange = (val: number[]) => {
		const snapped = snapToOptions(val[0], SIZE_OPTIONS);
		setChunkSize(snapped);
	};

	const handleOverlapChange = (val: number[]) => {
		const snapped = snapToOptions(val[0], OVERLAP_OPTIONS);
		setChunkOverlap(snapped);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave?.(chunkSize, chunkOverlap);
		onOpenChange(false); // Đóng dialog sau khi lưu
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
			<DialogContent className="sm:max-w-sm">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Cấu hình Chunk</DialogTitle>
						<DialogDescription>
							Điều chỉnh tham số để tăng hiệu quả RAG
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Field>
							<Label>Chunk Size</Label>
							<div className="flex items-center gap-4">
								<Slider
									value={[chunkSize]}
									min={500}
									max={2000}
									step={500}
									onValueChange={handleSizeChange}
									className="flex-1"
								/>
								<span className="w-12 text-sm font-medium">{chunkSize}</span>
							</div>
							<FieldDescription>
								Số ký tự tối đa mỗi chunk. <br />
								Chỉ nhận: 500, 1000, 1500, 2000
							</FieldDescription>
						</Field>
						<Field>
							<Label>Chunk Overlap</Label>
							<div className="flex items-center gap-4">
								<Slider
									value={[chunkOverlap]}
									min={50}
									max={200}
									step={50}
									onValueChange={handleOverlapChange}
									className="flex-1"
								/>
								<span className="w-12 text-sm font-medium">{chunkOverlap}</span>
							</div>
							<FieldDescription>
								Lượng văn bản chồng lấn giữa hai chunk. <br />
								Chỉ nhận: 50, 100, 150, 200
							</FieldDescription>
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Hủy
							</Button>
						</DialogClose>
						<Button type="submit">Lưu thay đổi</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
