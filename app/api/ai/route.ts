import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt, tone } = await req.json();
  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: `Generate a ${tone} Twitter post about: "${prompt}". Max 280 chars. Return only the post text.` }],
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("Anthropic API error:", JSON.stringify(data));
    return NextResponse.json({ error: data?.error?.message ?? "AI generation failed" }, { status: 500 });
  }
  const text = data.content?.[0]?.text ?? "";
  return NextResponse.json({ post: text });
}
