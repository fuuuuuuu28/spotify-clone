"use server";

import { Message } from "@/models/model";
import { auth } from "../auth";
import { headers } from "next/headers";
import { Types } from "mongoose";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// console.log("first", OPENROUTER_API_KEY);

type MessageType = {
  _id: Types.ObjectId;
  role: "user" | "model";
  content: string;
  user_id: string;
  createdAt: Date;
};

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  return { userId: session?.user.id };
}

export async function getChatHistory() {
  const { userId } = await requireUser();
  if (!userId) throw new Error("Unthorization");

  const messages = (await Message.find({ user_id: userId })
    .sort({ createdAt: 1 })
    .lean()) as MessageType[] | [];

  return messages?.map((m) => ({
    _id: m._id.toString(),
    role: m.role,
    content: m.content,
  }));
}

export async function reqChatbot(prompt: string) {
  const { userId } = await requireUser();
  if (!userId) throw new Error("Unthorization");

  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) throw new Error("Empty prompt");

  const task = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "stepfun/step-3.5-flash:free",
      messages: [
        {
          role: "system",
          content: `
            Bạn là chatbot hỗ trợ cho Spotify Clone.

            Chỉ trả lời các câu hỏi liên quan đến:
            - Âm nhạc
            - Playlist
            - Bài hát
            - Cách sử dụng ứng dụng

            Nếu ngoài phạm vi, hãy từ chối lịch sự.

            App sử dụng:
            - Next.js
            - MongoDB
            - Server Actions
            - Zustand`,
        },
        {
          role: "user",
          content: cleanPrompt,
        },
      ],
    }),
  });

  if (!task.ok) {
    const errText = await task.text();
    throw new Error(`OpenRouter error: ${task.status} ${errText}`);
  }

  const data = await task.json();
  const answer = data?.choices?.[0]?.message?.content ?? "No response";

  console.log("cleanPrompt", cleanPrompt);
  console.log("answer", answer);
  const userMsg = await Message.create({
    user_id: userId,
    role: "user",
    content: cleanPrompt,
  });

  const botMsg = await Message.create({
    user_id: userId,
    role: "model",
    content: answer,
  });

  return {
    userMsg: {
      _id: userMsg._id.toString(),
      role: "user",
      content: cleanPrompt,
    },
    botMsg: {
      _id: botMsg._id.toString(),
      role: "model",
      content: answer,
    },
  };
}
