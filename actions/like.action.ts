"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/app/generated/prisma/enums";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function toggleLike(
  postId: string
): Promise<ActionResponse<{ liked: boolean; count: number }>> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false, error: "User not found" };

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, authodId: true } });
    if (!post) return { success: false, error: "Post not found" };

    const existingLike = await prisma.like.findUnique({
      where: { userid_postId: { userid: user.id, postId } },
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({ where: { userid_postId: { userid: user.id, postId } } }),
        prisma.notification.deleteMany({
          where: { type: NotificationType.LIKE, userId: post.authodId, creatorId: user.id, postId },
        }),
      ]);
    } else {
      await prisma.like.create({ data: { userid: user.id, postId } });
      if (post.authodId !== user.id) {
        await prisma.notification.create({
          data: {
            type: NotificationType.LIKE,
            userId: post.authodId,
            creatorId: user.id,
            postId,
            commentId: "",
          },
        });
      }
    }

    const count = await prisma.like.count({ where: { postId } });
    return { success: true, data: { liked: !existingLike, count } };
  } catch (error) {
    console.error("[toggleLike]", error);
    return { success: false, error: "Failed to toggle like" };
  }
}
