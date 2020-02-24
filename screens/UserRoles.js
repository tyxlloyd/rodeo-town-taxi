import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';

class UserRoles extends React.Component {
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
          <StatusBar barStyle = "dark-content"/>
          <Text style={styles.titleLabel}> Rodeo Town Taxi</Text>


          <Button style={styles.button}
            full
            rounded
            light
            onPress={() => this.checkIfPermissionGranted('CLogin')}
          >
            <Text style={styles.buttonText}>Customer</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded
            light
            onPress={() => this.checkIfPermissionGranted('DLogin')}
          >
            <Text style={styles.buttonText}>Driver</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded
            light
            onPress={() => this.props.navigation.navigate('ALogin')} // Admin doesn't use the map
          >
            <Text style={styles.buttonText}>Admin</Text>
          </Button>

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
    padding: 15
  },
  button: {
    marginTop: 50,


  },
  buttonText: {
    color: 'black',
    fontSize: 25
  },
  titleLabel: {
    fontSize: 45,

  },

  label: {
    color: 'black'
  },
  textInput: {
      fontSize: 20

  }
});

export default UserRoles