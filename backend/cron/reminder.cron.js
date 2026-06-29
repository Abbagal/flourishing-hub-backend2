import cron from "node-cron";
import { prisma } from "../database/prisma.js";
import { sendReminderEmail } from "../services/email.service.js";
import { createNotificationsForUsers } from "../services/notification.service.js";

const sendRemindersForWindow = async (fromOffset, toOffset, label) => {
  const now = new Date();
  const from = new Date(now.getTime() + fromOffset);
  const to   = new Date(now.getTime() + toOffset);

  const upcomingEvents = await prisma.event.findMany({
    where: { status: "PUBLISHED", startAt: { gte: from, lte: to } },
    include: {
      registrations: {
        include: { user: { select: { id: true, name: true, email: true } } }
      },
      assignments: {
        include: { user: { select: { id: true, name: true, email: true } } }
      }
    }
  });

  for (const event of upcomingEvents) {
    const allUsers = [
      ...event.registrations.map(r => r.user),
      ...event.assignments.map(a => a.user)
    ];
    const uniqueUsers = [...new Map(allUsers.map(u => [u.id, u])).values()];
    const userIds = uniqueUsers.map(u => u.id);

    if (userIds.length) {
      await createNotificationsForUsers(
        userIds,
        "REMINDER",
        `⏰ Reminder: ${event.title}`,
        `Your workshop "${event.title}" starts ${label} at ${new Date(event.startAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST${event.venue ? ` — ${event.venue}` : ''}.`,
        event.id
      ).catch(() => {});
    }

    for (const user of uniqueUsers) {
      sendReminderEmail(user.email, user.name, event.title, event.startAt, event.venue).catch(() => {});
    }

    console.log(`[${label}] Sent reminders for: ${event.title} (${uniqueUsers.length} users)`);
  }
};

// Runs every hour at minute 0
export const startReminderCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      // 24-hour reminder (23–25 hours window)
      await sendRemindersForWindow(23 * 60 * 60 * 1000, 25 * 60 * 60 * 1000, "tomorrow");
      // 1-hour reminder (55–65 minutes window)
      await sendRemindersForWindow(55 * 60 * 1000, 65 * 60 * 1000, "in 1 hour");
    } catch (err) {
      console.error("Reminder cron error:", err);
    }
  });

  console.log("Reminder cron job started (runs every hour — 24h & 1h reminders)");
};
