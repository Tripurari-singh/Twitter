import { getNotifications } from "@/actions/notification.action";
import { markAllNotificationsRead } from "@/actions/notification.action";
import NotificationItem from "./NotificationItem";
import MarkAllRead from "./MarkAllRead";

export default async function NotificationList() {
  const { notifications, unreadCount } = await getNotifications();

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-white font-bold text-xl">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-sky-500/20 text-sky-400 text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && <MarkAllRead />}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-white/20 text-lg font-medium">No notifications yet</p>
          <p className="text-white/10 text-sm mt-1">When someone likes or follows you, it'll show here.</p>
        </div>
      ) : (
        notifications.map((n) => (
          <NotificationItem key={n.id} notification={n as any} />
        ))
      )}
    </div>
  );
}
