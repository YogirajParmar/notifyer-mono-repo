import { Notification } from "electron";
import path from "path";

export const sendNotification = async (
  title: string,
  body: string,
  urgency?: string
) => {
  const notification = new Notification({
    title,
    body,
    icon: path.join(__dirname, "assets/icons/favicon-32x32.png"),
    urgency: (urgency as "normal" | "low" | "critical") || "normal",
    timeoutType: "default",
    actions: [
      { type: "button", text: "Open App" },
      { type: "button", text: "Dismiss" },
    ],
  });

  notification.show();
  return notification;
};
