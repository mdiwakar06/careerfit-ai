"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ChatMessage } from "@/lib/types/evaluation";

interface GroundedChatProps {
  evaluationId?: string;
  targetRoleTitle: string;
  targetCompanyName: string;
}

export const GroundedChat: React.FC<GroundedChatProps> = ({
  evaluationId,
  targetRoleTitle,
  targetCompanyName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I am your **CareerFit AI Co-Pilot**. I have ingested your sanitized resume and the **${targetRoleTitle}** role at **${targetCompanyName}**.

Ask me anything about addressing experience gaps, tailoring your interview answers, drafting cold emails, or practicing technical system design questions!`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openCitationIdx, setOpenCitationIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPills = [
    "How should I address my experience gaps in the interview?",
    "Draft a 3-bullet cold email to the Engineering Hiring Manager",
    "What system design questions should I prepare for this role?",
    "Give me 3 strong talking points for my recruiter screen",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluationId: evaluationId || "default",
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMessage: textToSend,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          citations: data.citations,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || "Failed to generate answer");
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content:
          "I encountered an issue processing your query. Please try asking again in a moment.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] shadow-xs flex flex-col h-[640px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#f0f2ee] flex items-center justify-between bg-[#f7f8f6]/50 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#17211d] text-white">
            <Bot className="h-5 w-5 text-[#12715b]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#17211d]">
                Grounded Career Q&A Workspace
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e8f4f1] text-[#12715b]">
                pgvector RAG
              </span>
            </div>
            <p className="text-xs text-[#52605b]">
              Grounded exclusively in your sanitized resume and target job requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id || idx}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="h-8 w-8 rounded-lg bg-[#17211d] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-[#12715b]" />
                </div>
              )}

              <div
                className={`max-w-[84%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-2xs ${
                  isUser
                    ? "bg-[#17211d] text-white rounded-tr-xs"
                    : "bg-[#f7f8f6] text-[#17211d] border border-[#e3e6e1] rounded-tl-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Grounded Citations Dropdown */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#e3e6e1]/70">
                    <button
                      onClick={() =>
                        setOpenCitationIdx(openCitationIdx === idx ? null : idx)
                      }
                      className="flex items-center justify-between w-full text-[11px] font-semibold text-[#12715b] hover:underline"
                    >
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {msg.citations.length} Grounded Context Citations
                      </span>
                      {openCitationIdx === idx ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>

                    {openCitationIdx === idx && (
                      <div className="mt-2 space-y-1.5 pt-1">
                        {msg.citations.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2 rounded bg-[#ffffff] border border-[#e3e6e1] text-[10px] text-[#52605b] font-mono"
                          >
                            <span className="font-bold text-[#17211d] uppercase mr-1">
                              [{c.docType.replace("_", " ")}]:
                            </span>
                            "{c.snippet}"
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`text-[10px] text-right ${
                    isUser ? "text-white/60" : "text-[#52605b]"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="h-8 w-8 rounded-lg bg-[#e8f4f1] text-[#12715b] flex items-center justify-center shrink-0 mt-0.5 border border-[#12715b]/20">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="h-8 w-8 rounded-lg bg-[#17211d] text-white flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-[#12715b]" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#f7f8f6] border border-[#e3e6e1] text-xs text-[#52605b] flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#12715b]" />
              <span>Synthesizing grounded answer with pgvector chunks...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-4 py-2 bg-[#ffffff] border-t border-[#f0f2ee] flex items-center gap-2 overflow-x-auto">
        <Sparkles className="h-3.5 w-3.5 text-[#12715b] shrink-0" />
        <span className="text-[11px] font-semibold text-[#52605b] shrink-0">
          Suggested:
        </span>
        {starterPills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(pill)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f7f8f6] border border-[#e3e6e1] text-[#17211d] hover:border-[#12715b] hover:bg-[#e8f4f1]/60 transition-all shrink-0 whitespace-nowrap"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-[#f0f2ee] bg-[#ffffff] rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${targetRoleTitle || "this role"}... (e.g. "How to frame my AWS vs GCP experience?")`}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-[#e3e6e1] bg-[#f7f8f6] px-3.5 py-2.5 text-xs text-[#17211d] focus:border-[#12715b] focus:bg-[#ffffff] focus:ring-1 focus:ring-[#12715b] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-9 w-9 rounded-xl bg-[#17211d] text-white flex items-center justify-center hover:bg-[#12715b] disabled:opacity-40 transition-all shrink-0 shadow-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
