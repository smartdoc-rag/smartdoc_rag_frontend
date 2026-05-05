import type { HistoryMessage } from "@/types/chat.type";
import Question from "./Question";
import Answer from "./Answer";
import { Thinking } from "./Thinking";
import { EmptyChat } from "./EmptyChat";

type Props = {
    historyMessages: HistoryMessage[];
};

export default function ChatBoard({ historyMessages }: Props) {

    if (historyMessages.length === 0) {
        return <div className="h-full w-full">
            <EmptyChat />
        </div>
    }

    return (
        <div className="px-4 py-6 space-y-6">
            {historyMessages.map((messages) => (
                <div className="space-y-4" key={messages.tempId ?? messages.request_id}>
                    <Question
                        content={messages.question}
                    />

                    {
                        messages.isPending
                            ?
                            (<Thinking />)
                            :
                            (
                                <Answer
                                    messages={messages}
                                />
                            )

                    }
                </div>
            ))}
        </div>
    );
}