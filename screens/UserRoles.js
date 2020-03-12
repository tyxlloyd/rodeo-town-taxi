//imports for UI - react native attributes, and for firebase functionality
import React from 'react';
import { StyleSheet, Text, View, Alert, Image, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';

//clas UserRoles
class UserRoles extends React.Component {

  //TitlePicker function to display title correctly 
  //based on the operating system of the user, driver, 
  //or administrators device
  TitlePicker() {
    //the reason we need this is becasue adjustfontsize only works with ios
    if (Platform.OS == 'android') {
      return (

        <Text style={styles.titleLabel}>Rodeo Town Taxi</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Rodeo Town Taxi</Text>


      );

    }
  }

  //funtion _getPermissionAsync to ask for location permissions
  //to be able to show drivers-customers their locations for proper
  //directions and navigation purposes
  _getPermissionAsync = async (pageToNavigateTo) => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status !== 'granted') {
        Alert.alert("Please Enable Location Access",
          "We need your location to show your driver or customer where you are on the map. Please go into your device's settings menu to enable location services for Rodeo Town Taxi.");
      }
      else {
        this.props.navigation.navigate(pageToNavigateTo);
      }
    }
    catch (e) {
      console.log('_getPermissionAsyncError: ' + e)
    }
  }

  //render method which defines the user interface for the main page
  //of the application and asks the user if they would like to navigate
  //to the correct page: driver, customer, administrator, or about page
  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Form>
          <View style={styles.imageContainer}>
            <Image
              style={{ width: 310, height: 310 }}
              source={require('../assets/RTTIconTransparent.png')}
            />
          </View>

          <View style={styles.buttons}>
            <Button style={styles.button}
              full
              rounded
              light
              onPress={() => this._getPermissionAsync('CGuest')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.buttonText}>Customer</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded
              light
              onPress={() => this._getPermissionAsync('DLogin')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.buttonText}>Driver</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded
              light
              onPress={() => this.props.navigation.navigate('ALogin')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.buttonText}>Admin</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded
              light
              onPress={() => this.props.navigation.navigate('About')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.buttonText}>About</Text>
            </Button>
          </View>


        </Form>
      </Container>
    );


  }

}

//style sheet for the UserRoles.js page and its components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fec33a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 51
  },
  imageContainer: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:'white'

  },
  buttons: {

    marginTop: 50,
    //backgroundColor:'red'


  },
  titleContainer: {
    flex: 2,
    alignItems: "center",
    marginTop: 10,
    //marginBottom: 30,
    width: "100%",
    //backgroundColor:'blue'

  },
  button: {
    marginTop: 25,


  },
  buttonText: {
    color: 'black',
    fontSize: 30
  },
  titleLabel: {
    fontSize: 40,

  },

  label: {
    color: 'black'
  },
  textInput: {
    fontSize: 20

  }
});

//export UserRoles.js
export default UserRoles
