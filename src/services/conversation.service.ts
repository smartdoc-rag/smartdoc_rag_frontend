import api from "@/lib/axios";
import type {
	CursorPaginationParams,
	CursorResponse,
} from "@/types/common/pagination.type";
import type { ApiResponse } from "@/types/common/response.type";
import type {
	Conversation,
	ConversationConfigParam,
} from "@/types/conversation.type";

export const conversationService = {
	createConversation: async (title: string): Promise<Conversation> => {
		const res = await api.post<ApiResponse<Conversation>>(
			"/conversation/create/",
			{
				title,
			},
		);

		const { success, data, message, error } = res.data;

		if (!success || !data) {
			throw new Error(error || message || "Đăng ký thất bại");
		}

		return data;
	},

	getAllConversations: async (
		param: CursorPaginationParams,
	): Promise<CursorResponse<Conversation>> => {
		const { limit, cursor } = param;
		const params = new URLSearchParams();

		if (cursor) params.append("cursor", cursor);
		params.append("limit", limit.toString());

		const res = await api.get<ApiResponse<CursorResponse<Conversation>>>(
			`/conversation?${params.toString()}`,
		);

		const { data, success, error, message } = res.data;

		if (!success || !data) {
			throw new Error(error || message || "Fetch failed");
		}

		return data;
	},

	updateConversationTitle: async ({
		convId,
		newTitle,
	}: {
		convId: number;
		newTitle: string;
	}) => {
		try {
			const res = await api.put(`/conversation/${convId}/title`, {
				title: newTitle,
			});
			return res.data;
		} catch (error) {
			console.error(error);
			throw new Error("Lỗi khi sửa tên đoạn chat");
		}
	},

	updateLastChat: async (convId: number) => {
		try {
			const res = await api.patch(`/conversation/${convId}/last-chat`);
			return res.data;
		} catch (error) {
			console.error(error);
			throw new Error("Lỗi khi cập nhật last chat");
		}
	},

	deleteConversation: async (convId: number) => {
		try {
			const res = await api.delete(`/conversation/${convId}`);
			return res.data;
		} catch (error) {
			console.error(error);
			throw new Error("Lỗi khi xóa hội thoại");
		}
	},

	getConversationById: async (convId: number): Promise<Conversation> => {
		const res = await api.get<ApiResponse<Conversation>>(
			`/conversation/${convId}`,
		);

		const { success, data, message, error } = res.data;

		if (!success || !data) {
			throw new Error(error || message || "Lấy hội thoại theo id thất bại");
		}

		return data;
	},

	updateChunkConfig: async ({
		id,
		chunk_size,
		chunk_overlap,
	}: ConversationConfigParam): Promise<Conversation> => {
		const res = await api.patch<ApiResponse<Conversation>>(
			`/conversation/${id}/chunk-config`,
			{
				chunk_size,
				chunk_overlap,
			},
		);

		const { success, data, message, error } = res.data;

		if (!success || !data) {
			throw new Error(
				error || message || "Cập nhật config conversation thất bại",
			);
		}

		return data;
	},

	getSelectedFile: async (id: number): Promise<number[]> => {
		const res = await api.get<ApiResponse<{ file_ids: number[] }>>(
			`/conversation/${id}/selected-files`,
		);

		console.log("RES: ", res);

		const { success, data, message, error } = res.data;
		if (!success || !data) {
			throw new Error(error || message || "Lấy selected files thất bại");
		}
		return data.file_ids;
	},

	setSelectedFile: async (id: number, file_ids: number[]): Promise<void> => {
		const res = await api.post<ApiResponse<null>>(
			`/conversation/${id}/selected-files`,
			{ file_ids },
		);
		const { success, message, error } = res.data;
		if (!success) {
			throw new Error(error || message || "Cập nhật selected files thất bại");
		}
	},
};
