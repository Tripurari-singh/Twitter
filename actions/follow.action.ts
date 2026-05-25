"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/app/generated/prisma/enums";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function toggleFollow(
  targetUserId: string
): Promise<ActionResponse<{ following: boolean }>> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const me = await prisma.user.findUnique({ where: { clerkId } });
    if (!me) return { success: false, error: "User not found" };
    if (me.id === targetUserId) return { success: false, error: "Cannot follow yourself" };

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: me.id, followingId: targetUserId } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.follow.delete({
          where: { followerId_followingId: { followerId: me.id, followingId: targetUserId } },
        }),
        prisma.notification.deleteMany({
          where: { type: NotificationType.FOLLOW, userId: targetUserId, creatorId: me.id },
        }),
      ]);
      return { success: true, data: { following: false } };
    } else {
      await prisma.$transaction([
        prisma.follow.create({ data: { followerId: me.id, followingId: targetUserId } }),
        prisma.notification.create({
          data: {
            type: NotificationType.FOLLOW,
            userId: targetUserId,
            creatorId: me.id,
            postId: "",
            commentId: "",
          },
        }),
      ]);
      return { success: true, data: { following: true } };
    }
  } catch (error) {
    console.error("[toggleFollow]", error);
    return { success: false, error: "Failed to toggle follow" };
  }
}

export async function isFollowing(targetUserId: string): Promise<boolean> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return false;

    const me = await prisma.user.findUnique({ where: { clerkId } });
    if (!me) return false;

    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: me.id, followingId: targetUserId } },
    });
    return !!follow;
  } catch {
    return false;
  }
}

export async function getFollowers(username: string) {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return [];

    const follows = await prisma.follow.findMany({
      where: { followingId: user.id },
      include: {
        follower: { select: { id: true, username: true, name: true, image: true, bio: true } },
      },
    });
    return follows.map((f) => f.follower);
  } catch (error) {
    console.error("[getFollowers]", error);
    return [];
  }
}

export async function getFollowing(username: string) {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return [];

    const follows = await prisma.follow.findMany({
      where: { followerId: user.id },
      include: {
        following: { select: { id: true, username: true, name: true, image: true, bio: true } },
      },
    });
    return follows.map((f) => f.following);
  } catch (error) {
    console.error("[getFollowing]", error);
    return [];
  }
}
