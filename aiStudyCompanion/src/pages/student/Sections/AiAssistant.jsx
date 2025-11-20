import React, { useState } from "react";

export default function AiAssistantSection() {
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me anything about your course." },
  ]);

  function handleAskAI(e) {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = { role: "user", text: aiInput.trim() };
    const assistantMsg = {
      role: "assistant",
      text: `Thanks! (stubbed) Here's a helpful outline for: "${aiInput.trim()}"
- Key concept
- Example
- Next steps`,
    };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setAiInput("");
  }

  return (
    <article className="flex flex-col rounded-2xl border shadow-lg p-5 bg-white dark:bg-gray-800">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Assistant (Front-end demo)
        </h2>
        <p className="text-sm text-gray-500">
          Type a prompt; a stubbed reply will render below.
        </p>
      </header>

      <div className="flex-1 overflow-auto space-y-3 mb-3 pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block rounded-xl px-3 py-2 border ${
                m.role === "user" ? "bg-gray-100 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAskAI} className="flex gap-2">
        <input
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="Ask about topics, readings, deadlines…"
          className="flex-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-2"
        />
        <button
          type="submit"
          className="text-white bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Send
        </button>
      </form>
    </article>
  );
}
