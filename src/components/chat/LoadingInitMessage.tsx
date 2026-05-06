export default function LoadingInitMessage() {
    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Scrollable content area - có thể scroll nếu cần */}
            <div className="flex-1 overflow-y-hidden">
                <div className="flex flex-col gap-4 px-12 py-6 max-w-5xl mx-auto w-full">
                    <div className="flex justify-center">
                        <div className="w-24 h-5 bg-muted rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-2/3 max-w-[70%] space-y-2">
                            <div className="h-10 bg-muted rounded-2xl animate-pulse"></div>
                            <div className="flex justify-end">
                                <div className="w-12 h-3 bg-muted/50 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <div className="w-4/5 max-w-[70%] space-y-2">
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-full"></div>
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-10/12"></div>
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-9/12"></div>

                            {/* Citations skeleton */}
                            <div className="mt-3 p-3 bg-muted/30 rounded-xl space-y-2">
                                <div className="h-3 bg-muted rounded animate-pulse w-1/3"></div>
                                <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                                <div className="h-3 bg-muted rounded animate-pulse w-2/5"></div>
                            </div>

                            <div className="flex justify-start">
                                <div className="w-16 h-3 bg-muted/50 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Dual message skeletons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-full"></div>
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-11/12"></div>
                            <div className="h-16 bg-muted rounded-2xl animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-full"></div>
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-10/12"></div>
                            <div className="h-16 bg-muted rounded-2xl animate-pulse"></div>
                        </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex justify-center">
                        <div className="bg-muted rounded-2xl px-5 py-3 flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                Đang tải tin nhắn
                                <span className="animate-pulse">.</span>
                                <span className="animate-pulse delay-75">.</span>
                                <span className="animate-pulse delay-150">.</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ChatInput Skeleton - Fixed at bottom, không scroll */}
            <div className="shrink-0 border-t bg-background">
                <div className="max-w-4xl mx-auto w-full px-4 py-4">
                    <div className="relative">
                        {/* Main input area */}
                        <div className="w-full h-30 bg-muted rounded-2xl animate-pulse"></div>

                        {/* Action buttons */}
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            <div className="w-8 h-8 bg-muted/80 rounded-full animate-pulse"></div>
                            <div className="w-8 h-8 bg-muted/80 rounded-full animate-pulse"></div>
                            <div className="w-8 h-8 bg-muted/80 rounded-full animate-pulse"></div>
                        </div>

                        {/* Send button */}
                        <div className="absolute bottom-3 right-3">
                            <div className="w-8 h-8 bg-primary/30 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}