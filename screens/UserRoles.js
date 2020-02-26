import React from 'react';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';

class UserRoles extends React.Component {
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



  constructor(props) {
    super(props)
    this.state = {
      allowLocation: false,
    }

    this._getPermissionAsync();

  }



  _getPermissionAsync = async () => {
    try {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({ allowLocation: false });
        }
        else {
          this.setState({ allowLocation: true });
        }
    }

    catch (e) {
        console.log('_getPermissionAsyncError: ' + e)
    }
  }


  checkIfPermissionGranted(pageToNavigateTo){
    if(this.state.allowLocation == true){
      this.props.navigation.navigate(pageToNavigateTo);
    }
    else {
      Alert.alert("Please enable location access",
        "We need your location to use the map. Please go into your phone's settings menu to enable location services for Rodeo Town Taxi.");
    }
  }




  render() {
    return (
      <Container style={styles.container}>

        <Form>
          <View style={styles.titleContainer}>
            {this.TitlePicker()}
          </View>

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
              onPress={() => this.props.navigation.navigate('CLogin')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.buttonText}>Customer</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded
              light
              onPress={() => this.props.navigation.navigate('DLogin')}
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
          </View>


        </Form>
      </Container>
    );


  }

}

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

export default UserRoles
