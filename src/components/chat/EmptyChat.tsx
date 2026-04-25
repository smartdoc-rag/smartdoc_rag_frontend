export const EmptyChat = ({
    title = "Chưa có tin nhắn",
    description = "Hãy bắt đầu cuộc trò chuyện",
    icon = null
}) => {
    return (
        <div className="relative flex flex-col items-center justify-center h-full min-h-screen w-full overflow-hidden bg-background">
            {/* Animated gradient background using theme colors */}
            <div className="absolute inset-0 bg-linear-to-r from-background via-muted/50 to-background animate-gradient"></div>

            {/* Floating elements with theme colors */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>

            {/* Main content */}
            <div className="relative z-10 text-center space-y-8">
                {/* Animated icon container */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-linear-to-r from-primary/20 to-primary/10 rounded-full opacity-20 animate-ping"></div>
                    </div>
                    <div className="relative bg-card rounded-full p-6 shadow-lg border border-border">
                        {icon || (
                            <svg className="w-20 h-20 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Animated text with theme */}
                <div className="space-y-3 animate-fade-up">
                    <h2 className="text-3xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        {description}
                    </p>
                </div>

                {/* Typing indicator animation with theme colors */}
                <div className="flex justify-center space-x-2 mt-8">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};