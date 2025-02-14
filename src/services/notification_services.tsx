import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';


class NotificationService {
  constructor() {
    this.initialize();
  }

  async initialize() {
    console.log('################# Notification Token: Before ');
    await this.requestPermission();
    const fcmToken = await this.getToken();
    console.log('################# Notification Token:', fcmToken);

    // Save FCM Token
    await AsyncStorage.setItem('notification_token', fcmToken);


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
}

export default new NotificationService();
