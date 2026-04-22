import type { HistoryMessage } from "@/types/chat.type";
import Question from "./Question";
import Answer from "./Answer";

type Props = {
    messages: HistoryMessage[];
};

export default function ChatBoard({ messages }: Props) {
    return (
        <div className="px-4 py-6 space-y-6">
            {messages.map((msg) => (
                <div>
                    <Question
                        key={`question-${msg.request_id}`}
                        content={msg.question}
                    />

                    <Answer
                        key={`answer-${msg.request_id}`}
                        content={msg.answer || "Tôi bị ngu"}
                    />
                </div>
            ))}
        </div>
    );
}