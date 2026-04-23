export function Thinking() {
    return (
        <div className="flex items-center gap-2 text-muted-foreground py-2">
            <span className="text-sm">Bot đang suy nghĩ</span>

            <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
        </div>
    )
}