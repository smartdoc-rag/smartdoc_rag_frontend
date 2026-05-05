// ChatConfig.tsx
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useConfigStore } from "@/stores/useConfigStore";
import { Settings2, Check } from "lucide-react";


export function ChatConfig() {

	const { model, mode, setMode } = useConfigStore()

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings2 />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-72 p-3">
				<div className="text-base font-semibold mb-2">Chat config</div>
				<div className="space-y-3">
					{/* RAG mode */}
					<div
						className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-muted/50"
						onClick={() => setMode("rag")}
					>
						<div>
							<div className="font-medium">RAG mode</div>
							<div className="text-xs text-muted-foreground">
								Retrieval-Augmented Generation
							</div>
						</div>
						{mode === "rag" && <Check className="h-4 w-4 text-primary" />}
					</div>
					{/* GraphRAG mode */}
					<div
						className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-muted/50"
						onClick={() => setMode("graph_rag")}
					>
						<div>
							<div className="font-medium">GraphRAG mode</div>
							<div className="text-xs text-muted-foreground">
								Graph Retrieval-Augmented Generation
							</div>
						</div>
						{mode === "graph_rag" && <Check className="h-4 w-4 text-primary" />}
					</div>
					{/* Dual mode */}
					<div
						className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-muted/50"
						onClick={() => setMode("dual")}
					>
						<div>
							<div className="font-medium">Dual mode</div>
							<div className="text-xs text-muted-foreground">
								Run RAG and GraphRAG together
							</div>
						</div>
						{mode === "dual" && <Check className="h-4 w-4 text-primary" />}
					</div>
					{/* Model */}
					<div className="flex justify-between items-center pt-1 border-t mt-1">
						<span className="text-sm font-medium">Model:</span>
						<span className="text-sm">{model}</span>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
