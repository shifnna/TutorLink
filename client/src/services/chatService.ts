import axiosClient from "../api/axiosClient";
import { handleApi, ICommonResponse } from "../utils/apiHelper";
import { ROUTES } from "../utils/constants";
import { IChatParticipant, IChatMessage, IConversationSummary } from "../types/IChat";

export const chatService = {
  getSupportContact: async (): Promise<ICommonResponse<IChatParticipant>> =>
    handleApi(axiosClient.get(`${ROUTES.CHAT_API}/support-contact`)),

  getConversations: async (): Promise<ICommonResponse<IConversationSummary[]>> =>
    handleApi(axiosClient.get(`${ROUTES.CHAT_API}/conversations`)),

  getOrCreateConversation: async (otherUserId: string): Promise<ICommonResponse<{ _id: string }>> =>
    handleApi(axiosClient.post(`${ROUTES.CHAT_API}/conversations`, { otherUserId })),

  getMessages: async (conversationId: string): Promise<ICommonResponse<IChatMessage[]>> =>
    handleApi(axiosClient.get(`${ROUTES.CHAT_API}/conversations/${conversationId}/messages`)),

  sendMessage: async (conversationId: string, text: string): Promise<ICommonResponse<IChatMessage>> =>
    handleApi(axiosClient.post(`${ROUTES.CHAT_API}/messages`, { conversationId, text })),
};