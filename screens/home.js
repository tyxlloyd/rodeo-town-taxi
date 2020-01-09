import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header, Icon } from 'react-native-elements';

export default function Home({ navigation }) {

  return (
    <View>
      <Header
        leftComponent={ <Icon name = 'menu' color = '#000' onPress={(() => navigation.openDrawer())}/>}
        centerComponent={{ text: 'Home', style: { color: '#000' } }}
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
