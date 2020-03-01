import React from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';


class DriverInfo extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
      name: '',
      email: '',
      phoneNumber: '',
      emailError: false,
      nameError: false,
      phoneNumberError: false,

    })
  }

  ifEmptyToggle = (email, name, phoneNumber) => {
    if (email == '') {

      this.toggleEmailError('true');

    }
    if (name == '') {

      this.toggleNameError('true');

    }

    if (phoneNumber == '') {

      this.togglePhoneNumberError('true');

    }
  }

  ifNotEmptyToggle = (email, name, phoneNumber) => {
    if (email != '') {

      this.toggleEmailError('false');

    }

    if (name != '') {

      this.toggleNameError('false');

    }

    if (phoneNumber != '') {

      this.togglePhoneNumberError('false');

    }

  }
  navigateToProfile = (name, email, phoneNumber) => {

    if (email == '' || name == '' || phoneNumber == '') {

      this.ifEmptyToggle(email, name, phoneNumber);
      this.ifNotEmptyToggle(email, name, phoneNumber);
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

    this.ifNotEmptyToggle(email, name, phoneNumber);


    //email made lowercase because .exists is case sensitive
    var lEmail = email.toLowerCase();


    const dbh = firebase.firestore();
    var docName = dbh.collection("driver-info").doc(lEmail);



    //check if user is admin
    docName.get().then(function (doc) {
      if (doc.exists) {
        this.props.navigation.navigate('DModify', { name, email, phoneNumber })

      } else {

        alert("This driver does not exist")

      }
    }.bind(this)).catch(error => alert(error));

  }

  toggleEmailError = (bool) => {

    if (bool == 'true') {
      this.setState({
        emailError: true,
      });
    } else {
      this.setState({

        emailError: false,
      });
    }


  }

  toggleNameError = (bool) => {
    if (bool == 'true') {
      this.setState({
        nameError: true,
      });
    } else {
      this.setState({

        nameError: false,
      });
    }

  }

  togglePhoneNumberError = (bool) => {
    if (bool == 'true') {
      this.setState({
        phoneNumberError: true,
      });
    } else {
      this.setState({

        phoneNumberError: false,
      });
    }

  }
  TitlePicker() {
    //the reason we need this is becasue adjustfontsize only works with ios
    if (Platform.OS == 'android') {
      return (

        <Text style={styles.titleLabel}>Current Driver Info</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Current Driver Info</Text>


      );

    }
  }


  render() {
    return (
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <StatusBar barStyle="dark-content" />

          <Form>
            <View style={styles.titleContainer}>
              {this.TitlePicker()}
            </View>

            <Item rounded error={this.state.nameError ? true : false} style={styles.inputBox}>
              <Icon active name='contact' />
              <Input
                placeholder="Name"
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="words"
                autoCompleteType="name"
                onChangeText={(name) => this.setState({ name })}
              />
            </Item>

            <Item rounded error={this.state.emailError ? true : false} style={styles.inputBox}>
              <Icon active name='mail' />
              <Input
                placeholder="Email"
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="email"
                onChangeText={(email) => this.setState({ email })}
              />
            </Item>

            <Item rounded error={this.state.phoneNumberError ? true : false} style={styles.inputBox}>
              <Icon active name='call' />
              <Input
                placeholder="Phone Number"
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="tel"
                keyboardType="numeric"
                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              />
            </Item>

            <Button style={styles.button}
              full
              rounded

              onPress={() => this.navigateToProfile(this.state.name, this.state.email, this.state.phoneNumber)}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.regularButtonText}>Continue</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded

              onPress={() => this.props.navigation.navigate('AMain')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.regularButtonText}>Back</Text>
            </Button>

          </Form>
        </KeyboardAvoidingView>
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
    padding: 30
  },
  button: {
    marginTop: 40,
    backgroundColor: '#fec33a'

  },
  regularButtonText: {
    color: 'black',
    fontSize: 30
  },
  transparentButtonText: {
    color: 'black',
    fontSize: 20
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 25,
    width: "100%"
  },
  titleLabel: {
    fontSize: 40,

  },
  label: {
    color: 'black'
  },
  inputBox: {
    marginTop: 30,
    borderColor: 'black',
    //backgroundColor: '#fff',

  },
  textInput: {
    fontSize: 20

  }
});

export default DriverInfo
