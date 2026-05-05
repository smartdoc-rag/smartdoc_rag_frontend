
export default function LoadingPrevMessage() {
    return (
        <div className="flex justify-center py-2">
            <div className="bg-muted/50 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">Đang tải tin nhắn cũ...</span>
                </div>
            </div>
        </div>
    )
}
