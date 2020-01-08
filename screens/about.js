import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Platform } from 'react-native';

export default function About() {

  const dial = () => {
    if (Platform.OS === 'android') {
      phoneNumber = Linking.openURL('tel:${7198384002}');
    }
    else {
      phoneNumber = Linking.openURL('telprompt:${7198384002}');
    }
  }

  return (
    <View style={styles.container}>
      <Text>About.js!</Text>
        <TouchableOpacity onPress = {dial}>
          {/* Placeholder phone number. Change to Rodeo Town later */}
          <Text>(719)-838-4002</Text>
        </TouchableOpacity>
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
