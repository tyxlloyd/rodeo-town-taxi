import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
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
        'You are logged in as guest',
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

  render() {
    return (
      <Container style={styles.container}>

        <Form>
          <Label style={styles.titleLabel}> Welcome Customer</Label>

          <Button style={styles.button}
            full
            rounded
            //onPress={() => this.props.navigation.navigate('CInfo')}
            onPress={() => this.navigateToProfile(this.state.name, this.state.email, this.state.phoneNumber)}
          >
            <Text style={styles.buttonText}>Profile</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.props.navigation.navigate('CLogin')}

          >
            <Text style={styles.buttonText}>Back</Text>
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
  buttonText: {
    color: 'black',
    fontSize: 23
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

export default CustomerMain