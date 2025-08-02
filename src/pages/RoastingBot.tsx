"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";


type Message = {
  sender: "user" | "bot";
  text: string;
};

type FormData = {
  prompt: string;
};

export default function RoastMachine() {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const userMsg = data.prompt.trim();
    if (!userMsg) return;

    setLoading(true);

    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userMsg }),
      });

      const result = await res.json();
      console.log("🔥 API response:", result);

      if (result?.roast) {
        setChatLog((prev) => [...prev, { sender: "bot", text: result.roast }]);
      } else {
        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              "💥 API responded but didn't include `roast`. Here's what we got:\n" +
              JSON.stringify(result, null, 2),
          },
        ]);
      }
    } catch (err) {
      console.error("Roast failed:", err);
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", text: "💥 Your roast bot just rage quit." },
      ]);
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-300 flex flex-col items-center justify-center px-4 py-10">
    <div className="bg-white/90 backdrop-blur-md shadow-2xl border-2 border-zinc-800 rounded-2xl p-6 w-full max-w-2xl flex flex-col gap-4 transition-all">
      
      {/* 🔥 Title */}
      <h1 className="text-4xl font-extrabold text-zinc-900 text-center tracking-tight mb-2">
        🤖 RoastBot
      </h1>
      <p className="text-sm text-zinc-500 text-center mb-4">
        Drop a message. Get roasted. Cry silently.
      </p>
  
      {/* 🧾 Scrollable Chat Log */}
      <ScrollArea className="flex-1 h-[400px] pr-2 rounded-md border border-zinc-200 bg-zinc-50 shadow-inner">
        <div className="flex flex-col space-y-3 px-3 py-2">
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "max-w-[75%] px-4 py-2 rounded-lg text-sm break-words leading-relaxed shadow-sm",
                msg.sender === "user"
                  ? "self-end bg-blue-600 text-white rounded-br-none"
                  : "self-start bg-zinc-800 text-white rounded-bl-none"
              )}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </ScrollArea>
  
      {/* 💬 Input Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 mt-auto"
      >
        <Input
          type="text"
          placeholder="Say some dumb shit..."
          {...form.register("prompt", { required: true })}
          disabled={loading}
          className="flex-1 bg-white border border-zinc-400 shadow-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-zinc-900 text-white hover:bg-red-700 transition"
        >
          {loading ? "Cooking..." : "Roast Me"}
        </Button>
      </form>
    </div>
  </div>
  
  );
}
