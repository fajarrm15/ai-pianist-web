import Link from "next/link";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickPrompts = [
  {
    label: "10 min warm-up",
    prompt: "Give me a quick 10 minute piano warm-up routine",
  },
  {
    label: "Motivate me",
    prompt: "I'm not feeling motivated to practice today. Can you help?",
  },
  {
    label: "Beginner tips",
    prompt: "What are some essential tips for a beginner piano player?",
  },
  {
    label: "Left hand drills",
    prompt: "Give me some exercises to improve my left hand independence",
  },
];

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey there! 🎹 I'm your Piano Buddy. Whether you need practice tips, warm-up routines, or just some motivation — I'm here to help. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops, something went wrong. Let's try that again!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      <Head>
        <title>Piano Buddy | Piano Companion</title>
      </Head>

      <main className="min-h-screen bg-base-100 flex flex-col">
        {/* Header */}
        <header className="border-b border-base-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sage-400" />
              <h1 className="font-display font-semibold text-neutral-800">
                Piano Buddy
              </h1>
            </div>
            <div className="w-16" />
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-neutral-800 text-white rounded-br-md"
                      : "bg-base-200 text-neutral-700 rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-base-200 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-base-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4">
            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm bg-base-200 hover:bg-sage-50 hover:text-sage-700
                           text-neutral-600 rounded-full transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about piano..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-base-100 border border-base-300 
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-200
                         focus:border-sage-300 transition-all
                         disabled:opacity-50 placeholder:text-neutral-400"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-5 py-3 bg-neutral-800 hover:bg-neutral-900 text-white 
                         rounded-xl font-medium transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
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
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
