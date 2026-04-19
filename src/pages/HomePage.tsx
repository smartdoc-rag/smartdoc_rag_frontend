import FileUploadMode from "@/components/chat/UploadFileInput";

export default function HomePage() {
    return (
        <div className="flex h-screen w-full items-center justify-center relative">
            <div className="w-full max-w-4xl px-4">
                <FileUploadMode />
            </div>
        </div>
    )
}