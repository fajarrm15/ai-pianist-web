import Head from "next/head";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  PageLayout,
  Header,
  IconAvatar,
  Button,
  MiniPianoDecoration,
} from "@/components";
import { QUICK_PROMPTS, WELCOME_MESSAGE, type Message } from "@/const";

const STORAGE_KEY = "piano-buddy-chat-history";

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWarmedUp, setIsWarmedUp] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    }
  }, [messages, isLoaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pre-warm the LLM when page loads
  useEffect(() => {
    const warmUp = async () => {
      setIsWarmingUp(true);
      try {
        await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "hi" }],
            warmup: true,
          }),
        });
        setIsWarmedUp(true);
      } catch {
        // Ignore errors, warmup is best-effort
      } finally {
        setIsWarmingUp(false);
      }
    };

    warmUp();
  }, []);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oops, something went wrong. Let's try that again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Piano Buddy — Piano Companion</title>
      </Head>

      <PageLayout className="flex flex-col">
        <Header
          title="Piano Buddy"
          subtitle={
            isWarmingUp
              ? "Waking up..."
              : isWarmedUp
                ? "Online • Ready to help"
                : "Connecting..."
          }
          icon={<span className="text-lg">🎹</span>}
          rightContent={
            messages.length > 1 && (
              <button
                onClick={clearChat}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors px-2 py-1 rounded-lg hover:bg-stone-100 cursor-pointer"
                title="Clear chat history"
              >
                Clear chat
              </button>
            )
          }
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto relative z-0">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant Avatar */}
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 mt-1">
                    <IconAvatar size="sm">
                      <span className="text-sm">🎹</span>
                    </IconAvatar>
                  </div>
                )}

                <div className="max-w-[80%]">
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      message.role === "user"
                        ? "bg-stone-800 text-white rounded-br-md"
                        : "bg-white text-stone-700 rounded-bl-md border border-mint-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                      {message.content}
                    </p>
                  </div>
                  <p
                    className={`text-[11px] text-stone-400 mt-1.5 px-1 ${message.role === "user" ? "text-right" : "text-left"}`}
                  >
                    {index === 0
                      ? "Just now"
                      : new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </p>
                </div>

                {/* User Avatar */}
                {message.role === "user" && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shadow-sm border border-stone-200">
                      <svg
                        className="w-5 h-5 text-stone-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 mt-1">
                  <IconAvatar size="sm">
                    <span className="text-sm">🎹</span>
                  </IconAvatar>
                </div>
                <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-md border border-mint-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-mint-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-mint-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2 h-2 bg-mint-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                    <span className="text-sm text-stone-400">
                      {!isWarmedUp ? "Waking up Piano Buddy..." : "Thinking..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-mint-100 relative z-10">
          <div className="max-w-3xl mx-auto px-4 py-4">
            {/* Quick Prompts */}
            <div className="mb-4">
              <p className="text-xs text-stone-400 mb-2.5 font-medium flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  />
                </svg>
                Quick prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp.label}
                    onClick={() => sendMessage(qp.prompt)}
                    disabled={isLoading}
                    className="px-3.5 py-2 text-sm bg-mint-50 hover:bg-mint-100 border border-mint-200 
                             text-stone-600 rounded-xl transition-all cursor-pointer
                             disabled:opacity-50 disabled:cursor-not-allowed
                             hover:border-mint-300 hover:shadow-sm hover:text-stone-800"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about piano..."
                disabled={isLoading}
                className="flex-1 px-4 py-3.5 bg-white border border-stone-200 text-stone-800
                         rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint-300
                         focus:border-mint-400 transition-all shadow-sm
                         disabled:opacity-50 placeholder:text-stone-400"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                variant="primary"
                size="md"
                className="px-5 py-3.5"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </Button>
            </form>

            {/* Footer with mini piano decoration */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mint-200 to-transparent" />
              <MiniPianoDecoration />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mint-200 to-transparent" />
            </div>
            <p className="text-center text-xs text-stone-400 mt-2">
              Practice tips • Technique help • Theory explanations • Motivation
            </p>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
