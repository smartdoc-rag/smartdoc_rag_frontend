import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, Paperclip } from "lucide-react"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import FileUploadCard from "./FileUploadCard"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

export default function ChatInput() {
    const [value, setValue] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)


    // auto focus
    useEffect(() => {
        textareaRef.current?.focus()
    }, [])

    // auto resize
    const handleInput = () => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = el.scrollHeight + "px"
    }

    const handleSend = () => {
        if (!value.trim()) return

        console.log("Send:", value)
        setValue("")

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }

        setFiles([])
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (selectedFiles.length > 0) {
            setFiles(prev => [...prev, ...selectedFiles])
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleDeleteFile = (indexToDelete: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToDelete))
    }

    return (
        <Card className="bg-card border px-5">
            {files.length > 0 && (
                <ScrollArea className="w-full pb-3">
                    <div className="flex gap-3">
                        {files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="w-60 shrink-0">
                                <FileUploadCard
                                    file={file}
                                    onRemove={() => handleDeleteFile(index)}
                                />
                            </div>
                        ))}
                    </div>
                    <ScrollBar forceMount orientation="horizontal" />
                </ScrollArea>
            )}

            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                    handleInput()
                }}
                placeholder="Nhập câu hỏi..."
                className="
                    w-full resize-none outline-none
                    text-md placeholder:text-muted-foreground
                    max-h-60
                "
                rows={1}
            />

            <div className="flex justify-end">
                {/** Upload File Button */}
                <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="ghost"
                    size="icon-lg"
                    className="cursor-pointer"
                >
                    <Paperclip />
                </Button>

                {/** Send Button */}
                <Button
                    className="cursor-pointer"
                    size="icon-lg"
                    onClick={handleSend}
                    disabled={!value}
                >
                    <ArrowUp />
                </Button>

            </div>
        </Card>
    )
}