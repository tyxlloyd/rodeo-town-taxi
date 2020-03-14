import React from 'react';
import { StyleSheet, Linking, Platform, View, Dimensions, ScrollView, StatusBar } from 'react-native';
import { Header, Button, Text, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';



const dial = () => {
  if (Platform.OS === 'android') {
    Linking.openURL('tel:${5099294222}');
  }
  else {
    Linking.openURL('telprompt:${5099294222}');
  }
}

class About extends React.Component {
  render() {
    return (
      <View>
        <StatusBar barStyle="dark-content" />
        <Header
          leftComponent={
            <Icon name={'logout'}
              size={28}
              onPress={(() => this.props.navigation.navigate("URoles"))} />
          }
          centerComponent={{ text: 'About', style: { color: '#000', fontSize: 24, fontWeight: 'bold', fontFamily:'arvo-regular' } }}
          containerStyle={{ backgroundColor: '#fec33a' }}
        />
        <ScrollView>
        <Image
          style={{ width: '100%', height: 200 }}
          source={require('../assets/images/taxi.jpg')} />
          <View stlye={styles.secondContainer}>
        <Button
          title="Call Rodeo Town"
          titleStyle={styles.buttonText}
          onPress={dial}
          buttonStyle={styles.callButton}
        />
        <View styles={{justifyContent: 'space-around', alignItems: 'center'}}>
        <View styles={styles.secondContainer}>
        <Text h4 style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: 5, marginRight: 5}}>FAMILY OPERATED BUSINESS FOR 13 YEARS! </Text>
        </View>
        <View style={styles.secondContainer}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold'}}>SERVICES</Text>
        <Text style={{ textAlign: 'center' }}>We provide 24/7 service, along with courier, deliveries, lockouts and jump starts. </Text>
        </View>
        <View style={styles.secondContainer}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold'}}>SAFETY</Text>
        <Text style={{ textAlign: 'center' }}>Our drivers have passed background checks and fingerprinting.
          They are trained in CPR/First aid, driving defense courses, blood borne pathogens and safety seat training.</Text>
        </View>
        <View style={styles.secondContainer}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold'}}>HOURS OF OPERATION</Text>
        <Text style={{ textAlign: 'center' }}>We operate 24 hours a day and 7 days a week!</Text>
        </View>
        <View style={styles.secondContainer}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>DEVELOPED BY</Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Rodeo Speedwagon</Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Central Washington University</Text>
        <Text style={{ textAlign: 'center' }}>Tyler Lloyd, Junyu Lu, Austin Richardson, Jose Rodriguez, and Stephen Stengel</Text>
        </View>
        <View style={styles.secondContainer}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#0000EE' }} onPress={() => Linking.openURL('mailto:rodeotownapp@gmail.com')}>App support: rodeotownapp@gmail.com</Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#0000EE' }} onPress={() => Linking.openURL('https://github.com/tyxlloyd/rodeo-town-taxi/blob/master/documents/privacy_policy.md')}>Privacy Policy</Text>
        <Text>{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}</Text>
        </View>
        </View>
        </View>
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
  secondContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  button: {
    backgroundColor: '#484848'
  },
  callButton: {
    width: '80%',
    backgroundColor: '#484848',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 15,
    marginTop: 20,
    marginBottom: 40
  },
  buttonText: {
    fontFamily: 'arvo-regular'
  },
});

export default About;