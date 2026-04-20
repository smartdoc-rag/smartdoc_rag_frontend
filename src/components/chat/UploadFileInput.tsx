import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, FileUp } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import FileUploadCard from "./FileUploadCard";
import { fileService } from "@/services/file.service";
import { useCreateConv, useDeleteConv, useGetConversations } from "@/hooks/use-conversation";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function FileUploadInput() {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutateAsync } = useCreateConv()
    const { data: conversations } = useGetConversations()
    const { mutate: deleteConv } = useDeleteConv()

    const navigate = useNavigate()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0) {
            setFiles(prev => [...prev, ...selectedFiles]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDeleteFile = (indexToDelete: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToDelete));
    };


    const handleSubmit = async () => {
        try {
            setIsUploading(true);

            const title = `Đoạn chat ${conversations ? conversations.length + 1 : 'mới'}`
            const newConv = await mutateAsync(title)

            if (!newConv) {
                toast.error('Tạo hội thoại mới thất bại')
                return;
            }

            const formData = new FormData();
            files.forEach(file => {
                formData.append("files", file);
            });

            console.log(newConv)
            try {
                await fileService.uploadFiles(newConv.id, formData)
                navigate(`/c/${newConv.id}`)
            } catch (err) {
                console.error(err)
                deleteConv(newConv.id)
                toast.error('Lỗi')
            }

        } catch (err) {
            console.error(err)
            toast.error("Có lỗi xảy ra")
        } finally {
            setIsUploading(false); // ✅ QUAN TRỌNG
        }
    }

    return (
        <Card className="bg-card border p-6">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Tải file lên</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Hỗ trợ PDF, Docx,
                </p>
            </div>

            {/* Input*/}
            <div
                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer hover:bg-accent/50 transition-colors bg-muted/20"
                onClick={() => fileInputRef.current?.click()}
            >
                <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <FileUp className="h-12 w-12 text-muted-foreground" />
                <div className="text-center">
                    <span className="text-base font-medium text-muted-foreground">
                        Click để chọn file
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                        hoặc kéo thả file vào đây
                    </p>
                </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">
                            Danh sách file ({files.length})
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-sm"
                            onClick={() => setFiles([])}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Xóa tất cả
                        </Button>
                    </div>

                    <ScrollArea className="h-64 rounded-lg border p-2">
                        <div className="grid grid-cols-2 gap-3 pr-3">
                            {files.map((file, index) => (
                                <FileUploadCard
                                    key={`${file.name}-${index}`}
                                    file={file}
                                    onRemove={() => handleDeleteFile(index)}
                                />
                            ))}
                        </div>
                    </ScrollArea>

                    <Button
                        size="default"
                        className="w-full mt-4 h-10 text-base font-medium"
                        onClick={() => {
                            setIsUploading(true);
                            handleSubmit()
                        }}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                Đang tải lên...
                            </>
                        ) : (
                            `Bắt đầu xử lý ${files.length} file`
                        )}
                    </Button>
                </div>
            )}
        </Card>
    );
}