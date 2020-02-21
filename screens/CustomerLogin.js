import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';

class CustomerLogin extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
      name: '',
      email: '',
      phoneNumber: '',

    })
  }

  loginUser = (name, email, phoneNumber) => {
    try {
      if (email == '' || phoneNumber == '' || name == '') {
        Alert.alert(
          'Empty Fields',
          'Make sure all fields are filled out',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
        return;
      }
      //here there is no login with password you will simply add 
      //this users info to database along with user type: customer

      //email made lowercase because .exists is case sensitive
      var lEmail = email.toLowerCase();

      const dbh = firebase.firestore();
      var docName = dbh.collection("customer-info").doc(lEmail);

      //check if user exists to avoid adding them twice
      docName.get().then(function (doc) {
        if (doc.exists) {
          Alert.alert("Hello", "Welcome back " + name)
          //add function to update other user data if necessary
        } else {
          dbh.collection("customer-info").doc(lEmail).set({
            Name: name,
            Email: email,
            PhoneNumber: phoneNumber,
            Type: "Customer"
          })
          Alert.alert("Hello", "Welcome to the Rodeo Town Taxi App " + name)
        }
      }.bind(this)).catch(error => alert(error));


      this.props.navigation.navigate('CMain', { name, lEmail, phoneNumber })


    } catch (error) {
      console.log(error.toString())
    }



  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
        <Container style={styles.container}>
          <StatusBar barStyle="dark-content" />

          <Form>
            <Label style={styles.titleLabel}> Login</Label>

            <Item floatingLabel>
              <Label style={styles.label}> Name </Label>
              <Input
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="words"
                autoCompleteType="name"
                onChangeText={(name) => this.setState({ name })}
              />
            </Item>

            <Item floatingLabel>
              <Label style={styles.label}> Email </Label>
              <Input
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="email"
                onChangeText={(email) => this.setState({ email })}
              />
            </Item>

            <Item floatingLabel>
              <Label style={styles.label}> Phone Number </Label>
              <Input
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="tel"
                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              />
            </Item>

            <Button style={styles.button}
              full
              rounded
              onPress={() => this.loginUser(this.state.name, this.state.email, this.state.phoneNumber)}
            >
              <Text style={styles.buttonText}>Log in</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded
              onPress={() => this.props.navigation.navigate('CGuest')}
            >
              <Text style={styles.buttonText}>Continue as a guest</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded
              onPress={() => this.props.navigation.navigate('URoles')}
            >
              <Text style={styles.buttonText}>Home</Text>
            </Button>

          </Form>
        </Container>
      </TouchableWithoutFeedback>
    );


  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
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

export default CustomerLogin