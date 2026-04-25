import type { HistoryMessage } from "@/types/chat.type";
import Question from "./Question";
import Answer from "./Answer";
import { Thinking } from "./Thinking";
import { EmptyChat } from "./EmptyChat";

type Props = {
    messages: HistoryMessage[];
};

export default function ChatBoard({ messages }: Props) {

    if (messages.length === 0) {
        return <div className="h-full w-full">
            <EmptyChat />
        </div>
    }

    return (
        <div className="px-4 py-6 space-y-6">
            {messages.map((msg) => (
                <div key={msg.tempId ?? msg.request_id}>
                    <Question
                        content={msg.question}
                    />

                    {
                        msg.pending
                            ?
                            (<Thinking />)
                            :
                            (
                                <Answer
                                    content={msg.answer || "Tôi bị ngu"}
                                />
                            )

                    }
                </div>
            ))}
        </div>
    );
}