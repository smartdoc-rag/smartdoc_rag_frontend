export default function Answer({ content }: { content: string }) {
    return (
        <div className="flex justify-start">
            <div className="
				max-w-[70%] px-4 py-2 rounded-2xl
				bg-muted text-foreground
				shadow-sm
			">
                {content}
            </div>
        </div>
    );
}