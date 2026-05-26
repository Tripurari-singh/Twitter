// Threadly - Clerk Webhook
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return NextResponse.json({ error: "No webhook secret" }, { status: 500 });

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature)
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "user.created": {
      const { id, email_addresses, username, first_name, last_name, image_url } = event.data;
      const email = email_addresses[0]?.email_address ?? "";
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email,
          username: username ?? email.split("@")[0] ?? `user_${id.slice(-6)}`,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || null,
          image: image_url ?? null,
        },
      });
      break;
    }
    case "user.updated": {
      const { id, email_addresses, username, first_name, last_name, image_url } = event.data;
      await prisma.user.updateMany({
        where: { clerkId: id },
        data: {
          email: email_addresses[0]?.email_address ?? "",
          username: username ?? undefined,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || null,
          image: image_url ?? null,
        },
      });
      break;
    }
    case "user.deleted": {
      if (event.data.id) await prisma.user.deleteMany({ where: { clerkId: event.data.id } });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
