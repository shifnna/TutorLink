import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { chatService } from "../../services/chatService";
import { IChatMessage, IChatParticipant } from "../../types/IChat";
import { motion } from "framer-motion";

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };

const getInitials = (name?: string) =>
  !name ? "?" : name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const roleTagClass: Record<string, string> = {
  admin: "bg-white/10 text-[#9CA1B5]",
  tutor: "bg-[#7C9CFF]/15 text-[#7C9CFF]",
  client: "bg-[#C08BFA]/15 text-[#C08BFA]",
};

const formatTime = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  const sameDay = date.toDateString() === new Date().toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const Messages: React.FC = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const withUserId = searchParams.get("with");

  const {
    conversations, activeConversationId, latestIncomingMessage,
    setConversations, setActiveConversationId, clearLatestIncomingMessage,
  } = useChatStore();

  const [activeMessages, setActiveMessages] = useState<IChatMessage[]>([]);
  const [supportContact, setSupportContact] = useState<IChatParticipant | null>(null);
  const [input, setInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [convRes, supportRes] = await Promise.all([
        chatService.getConversations(),
        chatService.getSupportContact(),
      ]);
      if (convRes.success && convRes.data) setConversations(convRes.data);
      if (supportRes.success && supportRes.data) setSupportContact(supportRes.data);
    };
    load();
  }, [setConversations]);

  const selectConversation = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    setMobileChatOpen(true);
    setLoadingMessages(true);
    const res = await chatService.getMessages(conversationId);
    setLoadingMessages(false);
    if (res.success && res.data) setActiveMessages(res.data);
  };

  useEffect(() => {
    if (!withUserId) return;
    const openWithContact = async () => {
      const res = await chatService.getOrCreateConversation(withUserId);
      if (!res.success || !res.data) return;
      const refreshed = await chatService.getConversations();
      if (refreshed.success && refreshed.data) setConversations(refreshed.data);
      await selectConversation(res.data._id);
      setSearchParams({}, { replace: true });
    };
    openWithContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withUserId]);

  useEffect(() => {
    if (!latestIncomingMessage) return;
    if (latestIncomingMessage.conversationId === activeConversationId) {
      setActiveMessages((prev) => [...prev, latestIncomingMessage]);
    }
    clearLatestIncomingMessage();
  }, [latestIncomingMessage, activeConversationId, clearLatestIncomingMessage]);

  const startSupportChat = async () => {
    if (!supportContact) return;
    const res = await chatService.getOrCreateConversation(supportContact._id);
    if (!res.success || !res.data) return;
    const refreshed = await chatService.getConversations();
    if (refreshed.success && refreshed.data) setConversations(refreshed.data);
    await selectConversation(res.data._id);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeConversationId) return;
    setInput("");
    const res = await chatService.sendMessage(activeConversationId, text);
    if (res.success && res.data) {
      setActiveMessages((prev) => [...prev, res.data as IChatMessage]);
      const refreshed = await chatService.getConversations();
      if (refreshed.success && refreshed.data) setConversations(refreshed.data);
    }
  };

  const activeConversation = useMemo(
    () => conversations.find((c) => c._id === activeConversationId) || null,
    [conversations, activeConversationId]
  );
  const hasSupportThread = conversations.some((c) => c.otherUser.role === "admin");

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0E1016] text-[#F3F4F8] px-6 flex items-center justify-center pt-[80px]">
      <motion.div
  initial={{ opacity: 0, y: 30, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="w-full max-w-5xl flex h-[560px] bg-[#171A24] border border-[#2A2E3D] rounded-3xl overflow-hidden"
>

        <div className={`w-full sm:w-[300px] flex-shrink-0 border-r border-[#2A2E3D] flex-col ${mobileChatOpen ? "hidden sm:flex" : "flex"}`}>
          <div className="p-5 pb-3"><h1 style={fraunces} className="text-lg font-bold">Messages</h1></div>
          <div className="flex-1 overflow-y-auto">
            {user?.role !== "admin" && supportContact && !hasSupportThread && (
              <div onClick={startSupportChat} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-[#1E2230] border-b border-[#2A2E3D]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-[#6B7185] to-[#9CA1B5] text-[#0E1016]">
                  {getInitials(supportContact.name)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{supportContact.name}</div>
                  <div className="text-xs text-[#6B7185]">Contact support</div>
                </div>
              </div>
            )}
            {conversations.length === 0 && !supportContact && (
              <p className="text-sm text-[#6B7185] px-5 py-6">No conversations yet.</p>
            )}
            {conversations.map((c) => (
              <div key={c._id} onClick={() => selectConversation(c._id)}
                className={`flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#2A2E3D] border-l-2 ${
                  c._id === activeConversationId ? "bg-[#1E2230] border-l-[#7C9CFF]" : "border-l-transparent hover:bg-[#1E2230]"
                }`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] flex-shrink-0">
                  {getInitials(c.otherUser.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold truncate">
                      {c.otherUser.name}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium capitalize ${roleTagClass[c.otherUser.role] || ""}`}>{c.otherUser.role}</span>
                    </span>
                    <span className="text-[10px] text-[#6B7185] flex-shrink-0">{formatTime(c.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs text-[#9CA1B5] truncate mt-0.5">{c.lastMessage || "Start a conversation"}</p>
                </div>
                {c.unreadCount > 0 && <div className="w-2 h-2 rounded-full bg-[#7C9CFF] flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className={`flex-1 min-w-0 flex-col ${mobileChatOpen ? "flex" : "hidden sm:flex"}`}>
          {!activeConversation ? (
            <div className="flex-1 flex items-center justify-center text-[#6B7185] text-sm">Select a conversation to start chatting.</div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2A2E3D]">
                <button onClick={() => setMobileChatOpen(false)} className="sm:hidden text-[#9CA1B5] hover:text-[#F3F4F8]">←</button>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#0E1016]">
                  {getInitials(activeConversation.otherUser.name)}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  {activeConversation.otherUser.name}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium capitalize ${roleTagClass[activeConversation.otherUser.role] || ""}`}>{activeConversation.otherUser.role}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {loadingMessages ? (
                  <p className="text-xs text-[#6B7185] m-auto">Loading...</p>
                ) : activeMessages.length === 0 ? (
                  <p className="text-xs text-[#6B7185] m-auto max-w-[240px] text-center">This is the start of your conversation with {activeConversation.otherUser.name}.</p>
                ) : (
                  activeMessages.map((m) => (
                    <div key={m._id} className={`max-w-[65%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${
                      m.sender === user?._id
                        ? "self-end bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] rounded-br-sm font-medium"
                        : "self-start bg-[#1E2230] border border-[#2A2E3D] rounded-bl-sm"
                    }`}>{m.text}</div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-2 px-4 py-3 border-t border-[#2A2E3D]">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..." className="flex-1 bg-[#1E2230] border border-[#2A2E3D] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#7C9CFF] transition" />
                <button onClick={handleSend} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center text-[#0E1016] flex-shrink-0">➤</button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Messages;