// FileUploadCard.tsx
import { FileText, FileType, X } from "lucide-react";
import { Button } from "../ui/button";
import { formatFileSize } from "@/lib/utils";

export default function FileUploadCard({ file, onRemove }: { file: File; onRemove?: () => void }) {
    const getFileIcon = (file: File) => {
        const name = file.name.toLowerCase();
        const type = file.type;

        if (type.includes('word') || name.endsWith('.docx') || name.endsWith('.doc')) {
            return <FileType className="h-12 w-12 text-[#2B579A] dark:text-[#6B9FD2]" />;
        }
        if (type === 'application/pdf' || name.endsWith('.pdf')) {
            return <FileText className="h-12 w-12 text-[#E02128] dark:text-[#F87171]" />;
        }
        if (type === 'text/plain' || name.endsWith('.txt')) {
            return <FileText className="h-12 w-12 text-[#6B7280] dark:text-[#9CA3AF]" />;
        }
        return <FileText className="h-12 w-12 text-muted-foreground" />;
    };

    return (
        <div className="relative bg-muted/50 rounded-lg p-2 pr-6 group hover:bg-muted transition-colors">
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onRemove}
            >
                <X size={10} />
            </Button>

            <div className="flex items-center gap-2">
                {getFileIcon(file)}
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-md font-medium truncate max-w-60">
                        {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                    </span>
                </div>
            </div>
        </div>
    );
}