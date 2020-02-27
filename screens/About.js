import React from 'react';
import { StyleSheet, Linking, Platform, View, Dimensions, ScrollView} from 'react-native';
import { Header, Button, Text, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';



const dial = () => {
  if (Platform.OS === 'android') {
    phoneNumber = Linking.openURL('tel:${5099294222}');
  }
  else {
    phoneNumber = Linking.openURL('telprompt:${5099294222}');
  }
}

class About extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon name={'arrowleft'}
            size={28}
              onPress={(() => this.props.navigation.navigate("GlobalMap"))}/>
          }
          rightComponent={
            <Icon name={'logout'}
            size={28}
              onPress={(() => this.props.navigation.navigate("URoles"))}/>
          }
          centerComponent={{ text: 'About', style: { color: '#000', fontSize: 24, fontWeight: 'bold' } }}
          containerStyle={{ backgroundColor: '#fec33a' }}
        />
        <ScrollView>
        <Image
          style={{ width: '100%', height: 200 }}
          source={require('../assets/images/taxi.jpg')} />
        <Text></Text>
        <Text h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>FAMILY OPERATED BUSINESS FOR 13 YEARS! </Text>
        <Text></Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', textDecorationLine: 'underline' }}>SERVICES</Text>
        <Text style={{ textAlign: 'center' }}>We provide 24/7 service, along with courier, deliveries, lockouts and jump starts. </Text>
        <Text></Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', textDecorationLine: 'underline' }}>SAFETY</Text>
        <Text style={{ textAlign: 'center' }}>Our drivers have passed background checks and fingerprinting.</Text>
        <Text style={{ textAlign: 'center' }}>They are trained in CPR/First aid, driving defense courses, blood borne pathogens and safety seat training.</Text>
        <Text></Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', textDecorationLine: 'underline' }}>HOURS OF OPERATION</Text>
        <Text style={{ textAlign: 'center' }}>We operate 24 hours a day and 7 days a week!</Text>
        <Text></Text>
        {/* <Text style={{ fontWeight: 'bold' }}> This app is developed by Rodeo Speedwagon (Tyler Lloyd, Junyu Lu, Austin Richardson, Jose Rodriguez, and Stephen Stengel)</Text> */}
        <Button
          title="Call Rodeo Town"
          onPress={dial}
          buttonStyle={styles.callButton}
        />
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#484848'
  },
  callButton: {
    width: '80%',
    backgroundColor: '#484848',
    justifyContent: 'center',
    alignSelf: 'center'
  }
});

export default About;