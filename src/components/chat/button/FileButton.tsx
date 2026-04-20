import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ArchiveRestore, FolderCog, Plus, Upload } from "lucide-react";

export function FileButton() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					<Plus />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium">Upload config</p>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={() => console.log("mở config nâng cao")}
						>
							<FolderCog className="h-3 w-3" />
						</Button>
					</div>
					<div className="flex flex-col gap-1">
						<Button variant="ghost" size="sm" className="justify-start">
							<Upload />
							Upload from computer
						</Button>
						<Button variant="ghost" size="sm" className="justify-start">
							<ArchiveRestore />
							Add from local archive
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
