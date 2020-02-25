import React from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, Left, Body, Right, Title } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import * as firebase from 'firebase';
import '@firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';


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


  ifNotEmptyToggle = (email, password) => {
    if (email != '') {

      this.toggleEmailError('false');

    }

    if (password != '') {

      this.togglePasswordError('false');

    }

  }

  ifEmptyToggle = (email, password) => {
    if (email == '') {

      this.toggleEmailError('true');

    }

    if (password == '') {

      this.togglePasswordError('true');

    }
  }
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
            //alert(error)
            Alert.alert("Error", "Password is incorrect")
          }).then(() => this.changeStateOfLoading());


      } else {

        this.changeStateOfLoading();
        Alert.alert("Something went wrong", "You may not have an admin account");

      }
    }.bind(this)).catch(function (error) {
      Alert.alert("Something Went Wrong", "Ensure the information you entered is accurate.");
      this.props.navigation.navigate('URoles')
    });


  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
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

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">

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

          <Button
            full
            transparent
            rounded
            onPress={() => this.props.navigation.navigate('ForgotPassword')}

          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.transparentButtonText}>Reset Password</Text>
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
    //backgroundColor: '#fec33a',
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  button: {
    marginTop: 50,
    backgroundColor: '#fec33a',


  },
  regularButtonText: {
    color: 'black',
    fontSize: 30
  },
  transparentButtonText: {
    color: 'black',
    fontSize: 15
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

export default AdminLogin
