import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Header, Icon } from 'react-native-elements';

export default function userAccount({ navigation }) {

    return (
      <View>
        <StatusBar barStyle = "dark-content"/>
        <Header
          leftComponent={ <Icon name = 'menu' color = '#000' onPress={(() => navigation.openDrawer())}/>}
          centerComponent={{ text: 'Account', style: { color: '#000', fontFamily: 'arvo-regular', fontSize: 24 } }}
          containerStyle={{backgroundColor: '#F7FF00'}}
        />
        
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      textAlign: 'center',
    }
  });