import type { BotMessage, Citation } from "@/types/chat.type";

export default function BubbleChat({
    msg,
    className = "",
}: {
    msg: BotMessage;
    className?: string;
    onClickCitation?: (c: Citation) => void;
}) {
    return (
        <div
            className={`
                max-w-full px-4 py-3 rounded-2xl
                bg-muted text-foreground
                shadow-sm hover:shadow-md
                relative
                ${msg.type === 'rag' ? 'border-l-4 border-blue-500 dark:border-blue-400' : ''}
                ${msg.type === 'graphrag' ? 'border-l-4 border-purple-500 dark:border-purple-400' : ''}
                ${className}
            `}
        >
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-2">
                {msg.type === 'rag' && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        RAG
                    </span>
                )}
                {msg.type === 'graphrag' && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        GraphRAG
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
                {msg.content || " abc "}
            </div>
        </div>
    );
}