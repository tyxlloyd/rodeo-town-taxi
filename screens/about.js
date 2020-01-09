import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Platform } from 'react-native';
import { Header, Icon } from 'react-native-elements';

export default function About({ navigation }) {

  const dial = () => {
    if (Platform.OS === 'android') {
      phoneNumber = Linking.openURL('tel:${7198384002}');
    }
    else {
      phoneNumber = Linking.openURL('telprompt:${7198384002}');
    }
  }

  return (
    <View>
      <Header
        leftComponent={ <Icon name = 'menu' color = '#000' onPress={(() => navigation.openDrawer())}/>}
        centerComponent={{ text: 'About', style: { color: '#000' } }}
        containerStyle={{backgroundColor: '#F7FF00'}}
      />
      <View style={styles.container}>
        <Text>About.js!</Text>
        <TouchableOpacity onPress = {dial}>
          {/* Placeholder phone number. Change to Rodeo Town later */}
          <Text>(719)-838-4002</Text>
        </TouchableOpacity>
      </View>
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
