import api from "@/lib/axios";

export interface FileInfo {
	id: number;
	file_name: string;
	file_path: string; // đường dẫn file
	file_size: number;
	file_type: string;
	file_uploaded_at: string;
	scope: string;
	created_at: string;
}

export const fileService = {
	// lay het file da upload
	getFiles: async (conversationId: number): Promise<FileInfo[]> => {
		const res = await api.get<{
			data: {
				items: FileInfo[];
			};
		}>(`/file/${conversationId}/files/`);

		return res.data.data.items;
	},

	// Upload nhiều file
	uploadFiles: async (
		conversationId: number,
		formData: FormData,
	): Promise<FileInfo[]> => {
		const res = await api.post(`/file/${conversationId}/upload/`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		console.log("File: " + res);
		return res.data.data.uploaded;
	},

	// Xóa một file
	deleteFile: async (conversationId: number, fileId: number): Promise<void> => {
		await api.delete(`/file/${conversationId}/files/${fileId}/delete/`);
	},

	// Xóa tất cả file của conversation
	clearFiles: async (conversationId: number): Promise<void> => {
		await api.delete(`/file/${conversationId}/clear-files/`);
	},
};
