import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { LoaderCircle } from "lucide-react";

export function ContextUsage() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					<LoaderCircle />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start">
				<PopoverHeader>
					<PopoverTitle>Dimensions</PopoverTitle>
					<PopoverDescription>
						Set the dimensions for the layer.
					</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	);
}
