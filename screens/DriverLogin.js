import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';

class DriverLogin extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: '',
      taxiNumber: ''
    })
  }

  loginUser = (email, taxiNumber, password) => {

    if (email == '' || password == '' || taxiNumber == '') {
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
    //in addition to logging in with a password you will retrieve
    //user type for this user and in this case if the user type
    //is equal to driver then let them in else alert you are not a driver


    //email made lowercase because .exists is case sensitive
    var lEmail = email.toLowerCase();

    const dbh = firebase.firestore();
    var docName = dbh.collection("driver-info").doc(lEmail);
    //problem seems to be scope changing variable inside function does 
    //nothing


    //check if user is admin
    docName.get().then(function (doc) {
      if (doc.exists) {
        firebase.auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => this.props.navigation.navigate('DMain', { email, taxiNumber }))
          .catch(error => alert(error));
        //console.log("Document data:", doc.data());

        //add taxi number to database
        return docName.update({
          TaxiNumber: taxiNumber
        }).catch(error => Alert.alert("Error", error));

      } else {

        alert("You do not have a driver account")

      }
    }.bind(this)).catch(error => alert(error));


  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
        <Container style={styles.container}>
          <StatusBar barStyle="dark-content" />

          <Form>
            <Label style={styles.titleLabel}> Login</Label>
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
              <Label style={styles.label}> Taxi Number </Label>
              <Input
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"

                onChangeText={(taxiNumber) => this.setState({ taxiNumber })}
              />
            </Item>

            <Item floatingLabel>
              <Label style={styles.label}> Password </Label>
              <Input
                style={styles.textInput}
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="password"
                onChangeText={(password) => this.setState({ password })}
              />
            </Item>

            <Button style={styles.button}
              full
              rounded

              onPress={() => this.loginUser(this.state.email, this.state.taxiNumber, this.state.password)}
            >
              <Text style={styles.buttonText}>Log in</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded

              onPress={() => this.props.navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
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

export default DriverLogin