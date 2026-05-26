// Threadly - User Actions
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ActionResponse } from "@/types";

export async function syncUser(): Promise<ActionResponse<{ id: string }>> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: "Not authenticated" };

    const existing = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (existing) return { success: true, data: { id: existing.id } };

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const username = clerkUser.username ?? email.split("@")[0] ?? `user_${clerkUser.id.slice(-6)}`;

    const user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        username,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
        image: clerkUser.imageUrl ?? null,
      },
    });

    return { success: true, data: { id: user.id } };
  } catch (error) {
    console.error("[syncUser]", error);
    return { success: false, error: "Failed to sync user" };
  }
}

export async function getCurrentUser() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;
    return await prisma.user.findUnique({ where: { clerkId } });
  } catch (error) {
    console.error("[getCurrentUser]", error);
    return null;
  }
}

export async function getUserByUsername(username: string) {
  try {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        _count: { select: { posts: true, followers: true, following: true } },
      },
    });
  } catch (error) {
    console.error("[getUserByUsername]", error);
    return null;
  }
}

export async function updateProfile(data: {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  image?: string;
}): Promise<ActionResponse<{ username: string }>> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const user = await prisma.user.update({ where: { clerkId }, data });
    return { success: true, data: { username: user.username } };
  } catch (error) {
    console.error("[updateProfile]", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function searchUsers(query: string) {
  try {
    if (!query || query.trim().length < 2) return [];
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true, username: true, name: true, image: true, bio: true,
        _count: { select: { followers: true } },
      },
      take: 10,
    });
  } catch (error) {
    console.error("[searchUsers]", error);
    return [];
  }
}

export async function getSuggestedUsers() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return [];

    const me = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, following: { select: { followingId: true } } },
    });
    if (!me) return [];

    const alreadyFollowing = me.following.map((f) => f.followingId);

    return await prisma.user.findMany({
      where: { id: { notIn: [...alreadyFollowing, me.id] } },
      select: {
        id: true, username: true, name: true, image: true, bio: true,
        _count: { select: { followers: true } },
      },
      orderBy: { followers: { _count: "desc" } },
      take: 5,
    });
  } catch (error) {
    console.error("[getSuggestedUsers]", error);
    return [];
  }
}
