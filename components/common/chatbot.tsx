"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";

type ChatbotSubscriber = (open: boolean) => void;
let _chatbotOpen = false;
const _chatbotSubs = new Set<ChatbotSubscriber>();

function _emit() {
  for (const fn of _chatbotSubs) fn(_chatbotOpen);
}
export function openChatbot() {
  _chatbotOpen = true;
  _emit();
}
export function closeChatbot() {
  _chatbotOpen = false;
  _emit();
}
export function toggleChatbot() {
  _chatbotOpen = !_chatbotOpen;
  _emit();
}

interface Message {
  id?: string;
  timestamp?: Date;
  role: "user" | "ai";
  content: string;
}

const STORAGE_KEY = "chat_messages";
const WELCOME_ID = "welcome-msg";

const welcomeMessage: Message = {
  id: WELCOME_ID,
  content: "Hi! I'm your AI assistant. How can I help you today?",
  role: "ai",
  timestamp: new Date(),
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [inputValue, setInputValue] = useState("");

  const { data: session } = authClient.useSession();
  
  async function loadToken() {
    const { data, error } = await authClient.token();
    if (error) {
      console.error("Error retrieving token for chatbot:", error);
      return null;
    }
    if (data) {
      const jwtToken = data.token;
      console.log("Retrieved JWT token for chatbot:", jwtToken);
      return jwtToken;
    }
  }

  useEffect(() => {
    const sub: ChatbotSubscriber = (val) => setOpen(val);
    _chatbotSubs.add(sub);
    return () => {
      _chatbotSubs.delete(sub);
    };
  }, []);

  // Load only persisted (non-welcome) messages, then prepend welcome
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Message[] = JSON.parse(saved).map((m: Message) => ({
          ...m,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        }));
        if (parsed.length) setMessages([welcomeMessage, ...parsed]);
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
  }, []);

  // Persist without welcome message
  useEffect(() => {
    const toPersist = messages.filter((m) => m.id !== WELCOME_ID);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const performMessageSend = async (messageContent: string, currentToken: string) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      },
      body: JSON.stringify({ message: messageContent }),
    });
    if (res.status === 401) {
      throw new Error("Authentication failed");
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res;
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    if (loading) return; // Prevent multiple simultaneous requests
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    const messageContent = inputValue;
    setInputValue("");
    setMessages((prev) => [...prev, userMessage]);

    const aiMessageId = (Date.now() + 1).toString();
    const placeholder: Message = {
      id: aiMessageId,
      role: "ai",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, placeholder]);
    setLoading(true);

    try {
      if (process.env.LOCAL_AI_API_URL && process.env.LOCAL_AI_API_URL !== "") {
        // Use current token for the request
        const currentToken = await loadToken();
        if (!currentToken) {
          throw new Error("No valid authentication token available");
        }
        const res = await performMessageSend(messageContent, currentToken || "");
        
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream available");
        
        const decoder = new TextDecoder();
        let acc = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              if (data.trim()) {
                acc += data;
                setMessages((prev) =>
                  prev.map((m) => (m.id === aiMessageId ? { ...m, content: acc, timestamp: new Date() } : m))
                );
              }
            }
          }
        }
      } else {
        // Demo mode
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMessageId
                ? {
                    ...m,
                    content: "Thank you for your message! this is a demo response.",
                    timestamp: new Date(),
                  }
                : m
            )
          );
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId
            ? {
                ...m,
                content: `⚠️ Error: ${errorMessage}`,
                timestamp: new Date(),
              }
            : m
        )
      );
    } finally {
      if (!process.env.LOCAL_AI_API_URL) setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([welcomeMessage]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([])); // store empty
  };

  // EARLY RETURN: no session -> render nothing (no chatbot, no toggle button)
  if (!session?.user) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed z-1000 transition-all duration-300 ease-out ${
          open ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95 pointer-events-none"
        } ${isMobile && "inset-0"} sm:inset-[unset] sm:bottom-24 sm:right-6 sm:w-[380px] sm:top-auto sm:left-auto`}
        style={{ transformOrigin: "bottom right" }}
      >
        <div
          className="bg-card overflow-hidden flex flex-col h-full w-full rounded-none sm:rounded-3xl sm:h-[600px] sm:w-auto"
          style={{ boxShadow: "var(--shadow-float)" }}
        >
          <div
            className="p-3.5 pt-safe text-white relative overflow-hidden"
            style={{ background: "var(--gradient-vibrant)" }}
          >
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Chat Assistant</h3>
                  <p className="text-sm text-white/80">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearMessages}
                  className="text-white hover:bg-white/20 rounded-full"
                  title="Clear chat history"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeChatbot}
                  className="text-white hover:bg-white/20 rounded-full"
                  title="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 sm:p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-[hsl(var(--chat-user-bubble))] text-white rounded-br-md"
                        : "bg-[hsl(var(--chat-ai-bubble))] text-[hsl(var(--chat-ai-text))] rounded-bl-md"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content ||
                        (message.role === "ai" && loading ? (
                          <div className="flex space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          </div>
                        ) : (
                          ""
                        ))}
                    </div>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp instanceof Date
                        ? message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-3 sm:p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-2 focus-visible:ring-gray-300 text-base sm:text-sm"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                size="icon"
                className="rounded-full w-12 h-12 bg-gray-900"
                style={{ boxShadow: "var(--shadow-chat)" }}
                disabled={loading || !inputValue.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={toggleChatbot}
        className="fixed z-1000 bottom-6 right-6 w-16 h-16 rounded-full text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: "var(--gradient-vibrant)", boxShadow: "var(--shadow-chat)" }}
      >
        {open ? <X className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
      </button>
    </>
  );
}