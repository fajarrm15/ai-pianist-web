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
        "Hey there! 🎹 I'm your Piano Buddy. Whether you need practice tips, warm-up routines, or just some motivation—I'm here to help. What's on your mind?",
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

      <main className="min-h-screen bg-warm-50 flex flex-col">
        {/* Header */}
        <header className="border-b border-warm-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-warm-500 hover:text-rose-600 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="font-serif text-xl text-charcoal-900">
              Piano Buddy
            </h1>
            <div className="w-16" /> {/* Spacer for centering */}
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
                      ? "bg-rose-500 text-white rounded-br-md"
                      : "bg-white border border-warm-200 text-charcoal-800 rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-warm-200 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-2">
                    <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-warm-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-warm-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-warm-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm bg-warm-100 hover:bg-warm-200 
                           text-charcoal-700 rounded-full transition-colors
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
                className="flex-1 px-4 py-3 bg-warm-50 border border-warm-200 
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300
                         focus:border-transparent transition-all
                         disabled:opacity-50 placeholder:text-warm-400"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white 
                         rounded-xl font-medium transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
