import FileUploadInput from "@/components/chat/UploadFileInput";


export default function HomePage() {
	return (
		<div className="flex-1 relative">

			<div className="flex h-screen w-full items-center justify-center relative">
				<div className="w-full max-w-4xl px-4">
					<FileUploadInput />
				</div>
			</div>
		</div>
	);
}
