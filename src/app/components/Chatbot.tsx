"use client";

import { useAskToChatbot, useChatHistory } from "@/hooks/useChatbot";
import { Loader, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function RemarkContent({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:my-2 prose-li:my-1 prose-pre:my-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

function Chatbot({ isOpen }: { isOpen: boolean }) {
  const { mutate:askBot, isPending} = useAskToChatbot();
  const { data:messages, isLoading} = useChatHistory()
  const [input, setInput] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const msgsEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    msgsEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // useEffect(() => {
  //   if (isOpen) {
  //     loadChatHistory();
  //   }
  // }, [isOpen]);

  const handleInput = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setInput(target.value);

    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 200) + "px";
  };

  const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt) return;

    setInput("");
    await askBot(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`
        right-4 top-20 z-50 w-[30%] h-[calc(100vh-200px)]
        rounded-2xl bg-background-theme shadow-2xl
        transition-all duration-300 ease-out
        ${
          isOpen
            ? "fixed opacity-100 translate-y-0 scale-100"
            : "hidden opacity-0 translate-y-4 scale-95"
        }
      `}
    >
      <div className="h-[90%] overflow-auto scroll flex-1 px-2 py-4">
        {isLoading ? (
          <>
            <div className="flex items-center justify-center h-full max-w-3xl mx-auto p-4 rounded-xl">
              {"Loading...".split("").map((letter, i) => (
                <span
                  key={i}
                  className="text-xl text-primary-text inline-block animate-bounce "
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            {messages?.length === 0 ? (
              <>
                <div className="text-secondary-text font-bold text-xl text-center pt-36">
                  Tôi là chatbot AI sẽ hỗ trợ bạn
                </div>
              </>
            ) : (
              <>
                {messages?.map((msg) => (
                  <div
                    key={msg._id}
                    className={`${
                      msg.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    } py-2`}
                  >
                    <div
                      className={`${
                        msg.role === "user"
                          ? "bg-secondary-button rounded-b-2xl rounded-tl-2xl"
                          : "bg-blue-300 rounded-b-2xl rounded-tr-2xl"
                      } max-w-[90%] px-4 py-3 text-lg`}
                    >
                      <RemarkContent content={msg.content} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
      <div className="w-full bg-black rounded-xl px-4 pt-2">
        <div className="flex items-end justify-center gap-2 rounded-2xl border border-zinc-400 px-3 py-2">
          <textarea
            rows={1}
            value={input}
            onChange={handleInput}
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            placeholder="Đặt câu hỏi..."
            className="min-h-12 w-full resize-none bg-transparent px-1 py-2 text-lg outline-none placeholder:text-zinc-500 text-primary-text"
          />

          <button
            onClick={() => handleSend()}
            disabled={isPending}
            className="p-2 place-items-center rounded-xl bg-primary-button text-white transition hover:bg-secondary-button active:scale-95 disabled:opacity-50 disabled:hover:bg-zinc-600 hover:cursor-pointer "
          >
            {isPending ? (
              <Loader className="text-primary-text animate-spin" />
            ) : (
              <Send className="text-primary-text" />
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-zinc-500">
          Enter để gửi • Shift+Enter để xuống dòng
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
