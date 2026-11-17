"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Message } from "@/types/domain";

export function MatchChat({ matchId }: { matchId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const load = async () => {
    const res = await fetch(`/api/matches/${matchId}/messages`);
    if (!res.ok) return;
    const json = (await res.json()) as { messages: Message[] };
    setMessages(json.messages);
  };

  useEffect(() => {
    void load();
  }, [matchId]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(`/api/matches/${matchId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setText("");
      await load();
    }
  };

  return (
    <>
      <h1 className="font-heading mt-4 text-2xl">Conversation</h1>
      <div className="mt-6 flex-1 space-y-3 overflow-y-auto rounded border border-ns-border bg-ns-surface p-4">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <p className="text-ns-cream">{m.body}</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-ns-muted">
              {new Date(m.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-ns-muted">No messages yet. Say hello.</p>
        )}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message"
          className="flex-1 rounded border border-ns-border bg-ns-bg px-4 py-3 text-sm outline-none focus:border-ns-gold"
        />
        <button
          type="submit"
          className="rounded-full bg-ns-gold px-6 py-3 text-xs uppercase tracking-widest text-ns-bg"
        >
          Send
        </button>
      </form>
    </>
  );
}