import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import NotificationService from './src/services/notification_services';

export default function App() {

  useEffect(() => {
    console.log("aslkfjasldjflsadflsajdfl############3");
    NotificationService.initialize();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text>Hi, I am push notification</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
