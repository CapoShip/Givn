"use client";

import { useState } from "react";

export default function RequestAccessPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name || undefined }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setStatus("error");
      setMessage(data?.error ?? "Something went wrong.");
      return;
    }

    setStatus("success");
    setMessage("Thanks — we’ll reach out shortly.");
    setEmail("");
    setName("");
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl font-bold">Request access</h1>
      <p className="text-gray-600 mt-2">
        Join the early access list. We’ll contact you when onboarding opens.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@brand.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Name (optional)</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <button
          disabled={status === "loading"}
          className="px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-900 disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>

        {message ? (
          <p
            className={
              status === "error" ? "text-sm text-red-600" : "text-sm text-green-700"
            }
          >
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
