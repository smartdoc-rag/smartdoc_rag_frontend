// components/Answer.tsx
import type { HistoryMessage } from "@/types/chat.type";
import BubbleChat from "./BubbleChat";
import { AlertCircle } from "lucide-react";


export default function Answer({ messages }: { messages: HistoryMessage }) {
    const getGridCols = () => {
        if (messages.mode !== 'dual') return 'grid-cols-1';
        else; return 'grid-cols-2'
    };

    // Dual mode
    if (messages.mode === 'dual') {
        const gridCols = getGridCols();
        const responseCount = messages.responses.length;

        return (
            <div className={`grid ${gridCols} gap-12 w-[95%] relative`}>
                {messages.responses.map((msg, idx) => (
                    <BubbleChat
                        key={msg.response_id || idx}
                        msg={msg}
                        className="h-full"
                    />
                ))}

                {responseCount === 2 && (
                    <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                )}
            </div>
        );
    }

    // Single mode
    const singleMsg = messages.responses.at(0);
    if (!singleMsg) return (
        <>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
                Chưa có câu trả lời
            </span>
        </>
    );

    return (
        <div className="flex justify-start w-full">
            <BubbleChat
                msg={singleMsg}
                className="max-w-[85%] md:max-w-[70%]"
            />
        </div>
    );
}