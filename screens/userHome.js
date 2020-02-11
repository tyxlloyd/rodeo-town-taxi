import React from 'react';
import { StyleSheet, Dimensions, View, StatusBar, TouchableOpacity, Text } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { Map } from '../shared/userMap';
import { DriverMap } from '../shared/driverMap-stephen';
import { createDrawerNavigator } from 'react-navigation-drawer';
import About from '../screens/about';

export default function userHome () {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          leftComponent={<Icon name='menu' color='#000' onPress={(() => navigation.openDrawer())} />}
          centerComponent={{ text: 'Rodeo Town Taxi', style: { color: '#000', fontFamily: 'arvo-regular', fontSize: 24 } }}
          containerStyle={{ backgroundColor: '#F7FF00' }}
        />
        <DriverMap />
      </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const RootDrawerNavigator = createDrawerNavigator({
  Home: {
      screen: userHome,
  },

  About: {
      screen: About,
  },
  initialRouteName: 'Home',
});

