import { create } from "zustand";
import { IChatMessage, IConversationSummary } from "../types/IChat";

interface IChatState {
  conversations: IConversationSummary[];
  activeConversationId: string | null;
  latestIncomingMessage: IChatMessage | null;
  totalUnread: number;
  setConversations: (conversations: IConversationSummary[]) => void;
  setActiveConversationId: (id: string | null) => void;
  receiveMessage: (message: IChatMessage) => void;
  clearLatestIncomingMessage: () => void;
}

const computeUnread = (list: IConversationSummary[]) =>
  list.reduce((sum, c) => sum + c.unreadCount, 0);

export const useChatStore = create<IChatState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  latestIncomingMessage: null,
  totalUnread: 0,

  setConversations: (conversations) =>
    set({ conversations, totalUnread: computeUnread(conversations) }),

  setActiveConversationId: (id) => {
    const conversations = get().conversations.map((c) =>
      c._id === id ? { ...c, unreadCount: 0 } : c
    );
    set({ activeConversationId: id, conversations, totalUnread: computeUnread(conversations) });
  },

  receiveMessage: (message) => {
    const { conversations, activeConversationId } = get();
    const isActive = message.conversationId === activeConversationId;
    const updated = conversations.map((c) =>
      c._id === message.conversationId
        ? { ...c, lastMessage: message.text, lastMessageAt: message.createdAt, unreadCount: isActive ? 0 : c.unreadCount + 1 }
        : c
    );
    set({ conversations: updated, totalUnread: computeUnread(updated), latestIncomingMessage: message });
  },

  clearLatestIncomingMessage: () => set({ latestIncomingMessage: null }),
}));