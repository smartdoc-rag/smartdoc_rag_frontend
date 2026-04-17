import { FileText, FileType, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { formatFileSize } from "@/lib/utils";

export default function FileUploadCard({ file, onRemove }: { file: File; onRemove?: () => void }) {
    const getFileIcon = (file: File) => {
        const name = file.name.toLowerCase();
        const type = file.type;

        // Docx
        if (type.includes('word') || name.endsWith('.docx') || name.endsWith('.doc')) {
            return <FileType className="h-10 w-10 text-[#2B579A] dark:text-[#6B9FD2]" />;
        }
        // PDF
        if (type === 'application/pdf' || name.endsWith('.pdf')) {
            return <FileText className="h-10 w-10 text-[#E02128] dark:text-[#F87171]" />;
        }
        // Txt
        if (type === 'text/plain' || name.endsWith('.txt')) {
            return <FileText className="h-10 w-10 text-[#6B7280] dark:text-[#9CA3AF]" />;
        }
        // Khác
        return <FileText className="h-10 w-10 text-muted-foreground" />;
    };

    return (
        <Card className="bg-card border relative p-3 group hover:shadow-md transition-shadow">
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 rounded-full bg-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onRemove}
            >
                <X size={12} />
            </Button>

            <div className="flex items-center gap-2">
                {getFileIcon(file)}

                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">
                        {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                    </span>
                </div>
            </div>
        </Card>
    );
}