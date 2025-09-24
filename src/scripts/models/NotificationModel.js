// models/NotificationModel.js
import storyApi from "../services/api.js";
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
} from "../utils/notification.js";

export class NotificationModel {
  async subscribeUser() {
    try {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        const subscription = await subscribeToPushNotifications();
        if (subscription) {
          await storyApi.subscribeWebPush(subscription);
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to subscribe to notifications:", error);
    }
    return false;
  }
}
