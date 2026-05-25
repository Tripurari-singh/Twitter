"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createPost(data: {
  content: string;
  image?: string;
}): Promise<ActionResponse<{ id: string }>> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const author = await prisma.user.findUnique({ where: { clerkId } });
    if (!author) return { success: false, error: "User not found" };
    if (!data.content.trim()) return { success: false, error: "Content is required" };
    if (data.content.length > 280) return { success: false, error: "Post exceeds 280 characters" };

    const post = await prisma.post.create({
      data: { content: data.content, image: data.image ?? "", authodId: author.id },
    });

    return { success: true, data: { id: post.id } };
  } catch (error) {
    console.error("[createPost]", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { success: false, error: "Failed to create post" };
  }
}

export async function deletePost(postId: string): Promise<ActionResponse> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const author = await prisma.user.findUnique({ where: { clerkId } });
    if (!author) return { success: false, error: "User not found" };

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { success: false, error: "Post not found" };
    if (post.authodId !== author.id) return { success: false, error: "Unauthorized" };

    await prisma.post.delete({ where: { id: postId } });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("[deletePost]", error);
    return { success: false, error: "Failed to delete post" };
  }
}

export async function getFeed(page = 1, pageSize = 20) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { posts: [], total: 0 };

    const me = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, following: { select: { followingId: true } } },
    });
    if (!me) return { posts: [], total: 0 };

    const feedUserIds = [me.id, ...me.following.map((f) => f.followingId)];

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where: { authodId: { in: feedUserIds } },
        include: {
          author: { select: { id: true, username: true, name: true, image: true } },
          likes: { select: { userid: true } },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where: { authodId: { in: feedUserIds } } }),
    ]);

    return { posts, total };
  } catch (error) {
    console.error("[getFeed]", error);
    return { posts: [], total: 0 };
  }
}

export async function getUserPosts(username: string, page = 1, pageSize = 20) {
  try {
    const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!user) return { posts: [], total: 0 };

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where: { authodId: user.id },
        include: {
          author: { select: { id: true, username: true, name: true, image: true } },
          likes: { select: { userid: true } },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where: { authodId: user.id } }),
    ]);

    return { posts, total };
  } catch (error) {
    console.error("[getUserPosts]", error);
    return { posts: [], total: 0 };
  }
}

export async function getPost(postId: string) {
  try {
    return await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, username: true, name: true, image: true } },
        comments: {
          include: {
            author: { select: { id: true, username: true, name: true, image: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: { select: { userid: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });
  } catch (error) {
    console.error("[getPost]", error);
    return null;
  }
}
