import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';


class NotificationService {
  androidChannel: { channelId: string; channelName: string; channelDescription: string; };
  constructor() {
    this.androidChannel = {
      channelId: 'high_importance_channel',
      channelName: 'High Importance Notifications',
      channelDescription: 'This channel is used for important notifications.',
    };
    this.initialize();
  }

  async initialize() {
    console.log('################# Notification Token: Before ');
    await this.requestPermission();
    const fcmToken = await this.getToken();
    console.log('################# Notification Token:', fcmToken);

    // Save FCM Token
    await AsyncStorage.setItem('notification_token', fcmToken);

    this.initLocalNotifications();

    // Listen to notification events
    // messaging().onMessage(this.onForegroundMessageReceived.bind(this));
    // messaging().onNotificationOpenedApp(this.onMessageOpenedApp.bind(this));
    // messaging().setBackgroundMessageHandler(this.firebaseMessagingBackgroundHandler.bind(this));
  }

  // Request permission for notifications
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  }

  // Get FCM Token
  async getToken() {
    return await messaging().getToken();
  }

  // Initialize local notifications
  initLocalNotifications() {
    PushNotification.createChannel(
      {
        channelId: this.androidChannel.channelId,
        channelName: this.androidChannel.channelName,
        channelDescription: this.androidChannel.channelDescription,
        importance: 4, // High importance
        vibrate: true,
      },
      (created) => console.log(`CreateChannel returned '${created}'`) // Whether the channel was created
    );

    // Configure notifications for foreground
    PushNotification.configure({
      onNotification: (notification) => {
        console.log('Foreground Notification:', notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  // Handle foreground messages
  onForegroundMessageReceived(remoteMessage) {
    const { notification } = remoteMessage;

    if (!notification) return;

    PushNotification.localNotification({
      channelId: this.androidChannel.channelId,
      title: notification.title,
      message: notification.body,
      data: remoteMessage.data,
      smallIcon: 'ic_notification', // Replace with your app's icon
    });

    console.log('Received foreground message:', {
      id: remoteMessage.messageId,
      title: notification.title,
      body: notification.body,
    });
  }

  // Handle when the app is opened by clicking a notification
  onMessageOpenedApp(remoteMessage) {
    const { notification } = remoteMessage;

    console.log('Open Message on clicked:', {
      id: remoteMessage.messageId,
      title: notification?.title,
      body: notification?.body,
    });
  }

  // Background message handler
  async firebaseMessagingBackgroundHandler(remoteMessage) {
    const { notification } = remoteMessage;

    console.log('Received background message:', {
      id: remoteMessage.messageId,
      title: notification?.title,
      body: notification?.body,
    });
  }
}

export default new NotificationService();
