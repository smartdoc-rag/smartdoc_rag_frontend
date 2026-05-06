import type { HistoryMessage } from "@/types/chat.type";
import BubbleChat from "./BubbleChat";
import { AlertCircle } from "lucide-react";
import CitationList from "./CitationList";

export default function Answer({ messages }: { messages: HistoryMessage }) {

    const getGridCols = () => {
        return messages.mode === "dual" ? "grid-cols-2" : "grid-cols-1";
    };

    // Dual mode
    if (messages.mode === "dual") {
        const gridCols = getGridCols();

        return (
            <div className={`grid ${gridCols} gap-12 w-[95%] relative`}>
                {messages.responses.map((msg, idx) => (
                    <div key={msg.response_id || idx} className="flex flex-col gap-2">
                        <BubbleChat
                            msg={msg}
                        />

                        <CitationList
                            citations={msg.citations}
                        />
                    </div>
                ))}

                {messages.responses.length === 2 && (
                    <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
                )}
            </div>
        );
    }

    // Single mode
    const singleMsg = messages.responses.at(0);

    if (!singleMsg) {
        return (
            <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                    Chưa có câu trả lời
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-start">
                <BubbleChat
                    msg={singleMsg}
                    className="max-w-[85%] md:max-w-[70%]"
                />
            </div>

            <CitationList
                citations={singleMsg.citations}
            />
        </div>
    );
}