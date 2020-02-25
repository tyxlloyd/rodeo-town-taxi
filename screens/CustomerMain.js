import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';


class CustomerMain extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
      name: this.props.navigation.getParam('name'),
      email: this.props.navigation.getParam('lEmail'),
      phoneNumber: this.props.navigation.getParam('phoneNumber'),

    })
  }

  navigateToProfile = (name, email, phoneNumber) => {

    if (email == null || phoneNumber == null) {

      Alert.alert(
        'You are logged in as a guest',
        'Would you like to create account?',
        [
          //{ text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => this.props.navigation.navigate("CLogin") },
        ],
        { cancelable: false }
      );


    } else {
      this.props.navigation.navigate('CInfo', { name, email, phoneNumber })
    }


  }

  navigateToMap = (name) => {
    var taxiNumber = 0;
    var role = "customer";
    this.props.navigation.navigate("GlobalMap", { name, taxiNumber, role })
  }


  TitlePicker() {
    //the reason we need this is becasue adjustfontsize only works with ios
    if (Platform.OS == 'android') {
      return (

        <Text style={styles.titleLabel}>Welcome Customer</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Welcome Customer</Text>


      );

    }
  }


  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <Form>
          <View style={styles.titleContainer}>
            {this.TitlePicker()}
          </View>

          <Button style={styles.button}
            full
            rounded
            onPress={() => this.navigateToMap(this.state.name)}
          >
            <Text adjustFontSizeToFit
				numberOfLines={1}
			 	style={styles.regularButtonText}
			>Go To Map</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded
            //onPress={() => this.props.navigation.navigate('CInfo')}
            onPress={() => this.navigateToProfile(this.state.name, this.state.email, this.state.phoneNumber)}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.regularButtonText}>Profile</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.props.navigation.navigate('CLogin')}

          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.regularButtonText}>Back</Text>
          </Button>

        </Form>
      </Container>
    );


  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  button: {
    marginTop: 50,
    backgroundColor: '#fec33a'

  },
  regularButtonText: {
    color: 'black',
    fontSize: 30
  },
  titleLabel: {
    fontSize: 40,

  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%"
  },
  label: {
    color: 'black'
  },
  textInput: {
    fontSize: 20

  }
});

export default CustomerMain
