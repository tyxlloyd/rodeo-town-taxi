import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Header, Icon } from 'react-native-elements';

export default function Home({ navigation }) {

  return (
    <View>
      <StatusBar barStyle = "dark-content"/>
      <Header
        leftComponent={ <Icon name = 'menu' color = '#000' onPress={(() => navigation.openDrawer())}/>}
        centerComponent={{ text: 'Rodeo Town Taxi', style: { color: '#000', fontFamily: 'arvo-regular', fontSize: 24 } }}
        containerStyle={{backgroundColor: '#F7FF00'}}
      />
      <Text style = {styles.container}>Home.js!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
  },
});
