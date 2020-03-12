//imports for UI - react native attributes, and for firebase functionality
import React from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, Left, Body, Right, Title } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

//class AdminLogin
class AdminLogin extends React.Component {
  mounted = false;
  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: '',
      showPass: true,
      press: false,
      loading: false,
      emailError: false,
      passwordError: false

    })
  }

  //mounting function 
  componentWillUnmount() {
    this.mounted = false;
  }

  //fuction for loading 
  changeStateOfLoading = () => {
    if (this.mounted) {
      this.setState({

        loading: !this.state.loading,
      });
    }


  }


  //ifNotEmptyToggle to check if email and password input
  //is filled as it should be completely filled in
  ifNotEmptyToggle = (email, password) => {
    if (email != '') {

      this.toggleEmailError('false');

    }

    if (password != '') {

      this.togglePasswordError('false');

    }

  }

  //ifEmptyToggle function to check if email and password input is blank
  //as this is not allowed
  ifEmptyToggle = (email, password) => {
    if (email == '') {

      this.toggleEmailError('true');

    }

    if (password == '') {

      this.togglePasswordError('true');

    }
  }

  //loginUser function takes email and password input,
  //logs in the correct administrator, and redirects to the correct page
  loginUser = (email, password) => {
    this.mounted = true;

    if (email == '' || password == '') {
      this.ifEmptyToggle(email, password);
      this.ifNotEmptyToggle(email, password);
      Alert.alert(
        'Empty Fields',
        'Make sure all fields are filled out',
        [
          { text: 'OK', onPress: () => console.log('') },
        ],
        { cancelable: false },
      );
      return;
    }


    //turn off error if user inputs data
    this.ifNotEmptyToggle(email, password);

    this.changeStateOfLoading();

    //in addition to logging in with a password you will retrieve
    //user type for this user and in this case if the user type
    //is equal to admin then let them in else alert you are not an admin
    //timeout spinner in case error pops up

    //email made lowercase because .exists is case sensitive
    var lEmail = email.toLowerCase();


    const dbh = firebase.firestore();
    var docName = dbh.collection("admin-info").doc(lEmail);



    //check if user is admin
    docName.get().then(function (doc) {
      if (doc.exists) {
        firebase.auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => this.props.navigation.navigate('AMain'))
          .catch(function (error) {

            Alert.alert("Password is Incorrect", "Enter the correct password and try again")
          }).then(() => this.changeStateOfLoading());


      } else {

        this.changeStateOfLoading();
        Alert.alert("You do not have an Admin account", "Have an admin set up an account for you and try again");

      }
    }.bind(this)).catch(function (error) {
      Alert.alert("Something Went Wrong", "Ensure the information you entered is accurate");
      this.props.navigation.navigate('URoles');
    }.bind(this));


  }

  //showPass hides or unhides when entering the password to login
  //if the icon within that input box is selected or unselected 
  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }

  //toggleEmailError function sets flag for email errors
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

  //togglePasswordError function sets flag for password errors
  togglePasswordError = (bool) => {
    if (bool == 'true') {
      this.setState({
        passwordError: true,
      });
    } else {
      this.setState({

        passwordError: false,
      });
    }

  }


  //TitlePicker function to display title correctly 
  //based on the operating system of the user, driver, 
  //or administrators device
  TitlePicker() {
    //the reason we need this is becasue adjustfontsize only works with ios
    if (Platform.OS == 'android') {
      return (

        <Text style={styles.titleLabel}>Admin Login</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Admin Login</Text>


      );

    }
  }

  //render method which defines the user interface and askes for 
  //the email and password of the existing administrator 
  //to the log them in to their respective home page
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <StatusBar barStyle="dark-content" />

          <Form>

            <Spinner
              //visibility of Overlay Loading Spinner
              visible={this.state.loading}
              //Text with the Spinner
              //textContent={'Loading...'}
              //Text style of the Spinner Text
              textStyle={styles.spinnerTextStyle}
            />
            <View style={styles.titleContainer}>
              {this.TitlePicker()}
            </View>

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

            <Item error={this.state.passwordError ? true : false} rounded style={styles.inputBox}>
              <Icon active name='lock' />
              <Input
                placeholder="Password"
                style={styles.textInput}
                secureTextEntry={this.state.showPass}
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="password"
                onChangeText={(password) => this.setState({ password })}
              />
              <TouchableOpacity
                onPress={() => this.showPass()}>
                <Icon active name={this.state.press == false ? 'eye' : 'eye-off'} />
              </TouchableOpacity>



            </Item>

            <Button style={styles.button}
              full
              rounded

              onPress={() => this.loginUser(this.state.email, this.state.password)}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.regularButtonText}>Log in</Text>
            </Button>

            <Button style={styles.button}
              full

              rounded
              onPress={() => this.props.navigation.navigate('ForgotPassword')}

            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.regularButtonText}>Reset Password</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded

              onPress={() => this.props.navigation.navigate('URoles')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.regularButtonText}>Home</Text>
            </Button>


          </Form>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );


  }

}

//style sheet for the AdminLogin.js page and its components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fec33a',
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  button: {
    marginTop: 30,
    backgroundColor: '#fec33a',


  },
  regularButtonText: {
    color: 'black',
    fontSize: 30
  },
  transparentButtonText: {
    marginTop: 20,
    color: 'black',
    fontSize: 22
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
    color: 'black',

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

//export AdminLogin.js
export default AdminLogin
