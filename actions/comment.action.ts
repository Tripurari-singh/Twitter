"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/app/generated/prisma/enums";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function addComment(
  postId: string,
  content: string
): Promise<ActionResponse<{ id: string }>> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false, error: "User not found" };
    if (!content.trim()) return { success: false, error: "Comment cannot be empty" };
    if (content.length > 280) return { success: false, error: "Comment exceeds 280 characters" };

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, authodId: true } });
    if (!post) return { success: false, error: "Post not found" };

    const comment = await prisma.comment.create({
      data: { content, authorId: user.id, postId },
    });

    if (post.authodId !== user.id) {
      await prisma.notification.create({
        data: {
          type: NotificationType.COMMENT,
          userId: post.authodId,
          creatorId: user.id,
          postId,
          commentId: comment.id,
        },
      });
    }
    return { success: true, data: { id: comment.id } };
  } catch (error) {
    console.error("[addComment]", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function deleteComment(commentId: string): Promise<ActionResponse> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false, error: "User not found" };

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return { success: false, error: "Comment not found" };
    if (comment.authorId !== user.id) return { success: false, error: "Unauthorized" };

    await prisma.comment.delete({ where: { id: commentId } });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("[deleteComment]", error);
    return { success: false, error: "Failed to delete comment" };
  }
}

export async function getComments(postId: string) {
  try {
    return await prisma.comment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, username: true, name: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("[getComments]", error);
    return [];
  }
}
