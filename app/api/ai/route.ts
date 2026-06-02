import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt, tone } = await req.json();
  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

  // MOCK MODE — real API commented out due to low credits
  // Uncomment below and remove mock when credits are topped up
  await new Promise((r) => setTimeout(r, 1500));
  const mockPosts: Record<string, string> = {
    professional: `Excited to share my thoughts on ${prompt}. The implications for our industry are significant, and staying ahead of these trends is crucial for long-term success.`,
    casual: `Just been thinking about ${prompt} and honestly? It's more interesting than I thought. Anyone else down the rabbit hole on this?`,
    humorous: `Me before learning about ${prompt}: completely fine. Me after: cannot stop thinking about it. Send help.`,
    inspirational: `${prompt} taught me that growth happens outside your comfort zone. Every challenge is just an opportunity wearing a disguise.`,
    informative: `Here's what you need to know about ${prompt}: it's reshaping how we think about the future. The data speaks for itself.`,
  };
  const text = mockPosts[tone] ?? mockPosts.casual;
  return NextResponse.json({ post: text.slice(0, 280) });

  /*
  // REAL ANTHROPIC API — uncomment when credits are available
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
  */
}
