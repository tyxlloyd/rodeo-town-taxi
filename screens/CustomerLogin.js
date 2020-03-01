import React from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import * as firebase from 'firebase';
import '@firebase/firestore';

class CustomerLogin extends React.Component {
  mounted = false;
  constructor(props) {
    super(props)

    this.state = ({
      name: '',
      email: '',
      phoneNumber: '',
      loading: false,
      emailError: false,
      nameError: false,
      phoneNumberError: false,


    })
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  changeStateOfLoading = () => {
    if (this.mounted) {
      this.setState({

        loading: !this.state.loading,
      });
    }


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

  loginUser = (name, email, phoneNumber) => {
    this.mounted = true;
    try {
      if (email == '' || phoneNumber == '' || name == '') {
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
      this.changeStateOfLoading();



      //here there is no login with password you will simply add 
      //this users info to database along with user type: customer

      //email made lowercase because .exists is case sensitive
      var lEmail = email.toLowerCase();

      const dbh = firebase.firestore();
      var docName = dbh.collection("customer-info").doc(lEmail);

      //check if user exists to avoid adding them twice
      docName.get().then(function (doc) {
        if (doc.exists) {

          this.props.navigation.navigate('CMain', { name, lEmail, phoneNumber })

        } else {
          dbh.collection("customer-info").doc(lEmail).set({
            Name: name,
            Email: email,
            PhoneNumber: phoneNumber,
            Type: "Customer"
          });


          this.props.navigation.navigate('CMain', { name, lEmail, phoneNumber })
        }
      }.bind(this)).catch(function (error) {
        Alert.alert("Something Went Wrong", "Try again");

      }).then(() => this.changeStateOfLoading());

    } catch (error) {
      Alert.alert("Something Went Wrong", "Try again later");
      this.props.navigation.navigate('URoles')
    }



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

        <Text style={styles.titleLabel}>Customer Login</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Customer Login</Text>


      );

    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner
          //textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
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
              onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
            />
          </Item>

          <Button style={styles.button}
            full
            rounded
            onPress={() => this.loginUser(this.state.name, this.state.email, this.state.phoneNumber)}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.regularButtonText}>Log in</Text>
          </Button>

          <Button
            full
            transparent
            rounded
            onPress={() => this.props.navigation.navigate('CGuest')}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.transparentButtonText}>Continue as a guest</Text>
          </Button>

          <Button
            full
            rounded
            transparent

            onPress={() => this.props.navigation.navigate('URoles')}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.transparentButtonText}>Home</Text>
          </Button>

        </Form>
      </KeyboardAvoidingView>
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
    marginTop: 50,
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
    marginBottom: 40,
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

export default CustomerLogin