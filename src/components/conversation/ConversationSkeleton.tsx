// components/skeleton/ConversationSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { convLimit } from "@/constants/const";

export function ConversationSkeleton() {
    return (
        <>
            {[...Array(convLimit)].map((_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 rounded-md"
                >
                    <div className="flex flex-col gap-1 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            ))}
        </>
    );
}