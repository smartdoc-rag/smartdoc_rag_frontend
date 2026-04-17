import ChatInput from "@/components/chat/ChatInput";

export default function HomePage() {
    return (
        <div className="flex h-screen w-full items-center justify-center relative">
            <div className="w-full max-w-4xl px-4">
                <div className="text-center absolute right-0 left-0 top-1/4">
                    <h1 className="text-3xl text-foreground font-medium">
                        Xin chào , bạn muốn làm gì hôm nay ?
                    </h1>
                </div>
                <ChatInput />
            </div>
        </div>
    )
}