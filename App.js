import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './routes/drawer';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const getFonts = () => Font.loadAsync({
  'arvo-regular': require('./assets/fonts/Arvo-Regular.ttf'),
  'arvo-bold': require('./assets/fonts/Arvo-Bold.ttf'),
});

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  if(fontsLoaded){
    return (
      <Navigator />
    );
  } else {
    return(
      <AppLoading
        startAsync = {getFonts}
        onFinish = {() => setFontsLoaded(true)}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
