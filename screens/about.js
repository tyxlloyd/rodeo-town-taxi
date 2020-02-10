import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, Linking, Platform, Image } from 'react-native';
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
    <ScrollView>
      <Header
        leftComponent={ <Icon name = 'menu' color = '#000' onPress={(() => navigation.openDrawer())}/>}
        centerComponent={{ text: 'About', style: { color: '#000',  fontSize: 24, fontWeight:'bold' } }}
        containerStyle={{backgroundColor: '#F7FF00'}}
      />
      <Text style = {styles.container}>Rodeo Town Taxi</Text>
      <TouchableOpacity onPress = {dial}>
        {/* Placeholder phone number. Change to Rodeo Town later */}
        <Text style = {styles.container}>(719)-838-4002</Text>
      </TouchableOpacity>
	  
	 
		
		<Image
		style={{width: 330, height: 250}}
		source={require('./assets/about.jpg')} />
			<Image
          style={{width: 320, height: 250}}
          source={{uri: 'https://lh3.googleusercontent.com/g2GhbnfgVBIAiENoxutMki-7Kp7-RIblq8QIg9JDnsMxMHRGsEGz2N_Bn2pnlFZnN8oOWIMM=w1080-h608-p-no-v0'}}
        />
		<Text style={{fontWeight:'bold'}}> This app is developed by Rodeo Speedwagon (Tyler Lloyd, Junyu Lu, Austin Richardson, Jose Rodriguez, and Stephen Stengel )</Text>
	
    </ScrollView>
	
	
	
	
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
  },
  
});