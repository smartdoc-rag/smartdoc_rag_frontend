export default function Question({ content }: { content: string }) {
    return (
        <div className="flex justify-end">
            <div className="
				max-w-[70%] px-4 py-2 rounded-2xl
				bg-primary text-primary-foreground
				shadow-sm
			">
                {content}
            </div>
        </div>
    );
}