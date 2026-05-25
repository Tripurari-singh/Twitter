"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ActionResponse } from "@/types";

export async function getNotifications(page = 1, pageSize = 20) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { notifications: [], unreadCount: 0 };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { notifications: [], unreadCount: 0 };

    const [notifications, unreadCount] = await prisma.$transaction([
      prisma.notification.findMany({
        where: { userId: user.id },
        include: {
          creator: { select: { id: true, username: true, name: true, image: true } },
          post: { select: { id: true, content: true } },
          comment: { select: { id: true, content: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.notification.count({ where: { userId: user.id, read: false } }),
    ]);

    return { notifications, unreadCount };
  } catch (error) {
    console.error("[getNotifications]", error);
    return { notifications: [], unreadCount: 0 };
  }
}

export async function markNotificationRead(notificationId: string): Promise<ActionResponse> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false, error: "User not found" };

    await prisma.notification.updateMany({
      where: { id: notificationId, userId: user.id },
      data: { read: true },
    });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("[markNotificationRead]", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResponse> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false, error: "User not found" };

    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("[markAllNotificationsRead]", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}

export async function deleteNotification(notificationId: string): Promise<ActionResponse> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false, error: "User not found" };

    await prisma.notification.deleteMany({ where: { id: notificationId, userId: user.id } });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("[deleteNotification]", error);
    return { success: false, error: "Failed to delete notification" };
  }
}
