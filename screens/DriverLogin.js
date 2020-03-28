import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Form, Input, Item, Button, Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import * as firebase from 'firebase';

class DriverLogin extends React.Component {
  mounted = false;

  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: '',
      taxiNumber: '',
      showPass: true,
      press: false,
      loading: false,
      emailError: false,
      passwordError: false,
      taxiNumberError: false,
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

  ifEmptyToggle = (email, taxiNumber, password) => {
    if (email == '') {

      this.toggleEmailError('true');

    }
    if (taxiNumber == '') {

      this.toggleTaxiNumberError('true');

    }

    if (password == '') {

      this.togglePasswordError('true');

    }
  }

  ifNotEmptyToggle = (email, taxiNumber, password) => {
    if (email != '') {

      this.toggleEmailError('false');

    }

    if (taxiNumber != '') {

      this.toggleTaxiNumberError('false');

    }

    if (password != '') {

      this.togglePasswordError('false');

    }

  }
  numbersOnly = (numbers) => {
    let reg = /^[0-9]+$/;
    if (reg.test(numbers) == false) {
      Alert.alert("Incorrect Format", "Taxi numbers should only contain digits without spaces or special characters")
      return false;
    }
    else {

      return true;
    }
  }


  loginUser = (email, taxiNumber, password) => {
    this.mounted = true;
    if (email == '' || password == '' || taxiNumber == '') {

      this.ifEmptyToggle(email, taxiNumber, password);
      this.ifNotEmptyToggle(email, taxiNumber, password);

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

    //turn off error if user inputs data
    this.ifNotEmptyToggle(email, taxiNumber, password);

    if (this.numbersOnly(taxiNumber) == false) {
      return;
    }
    this.changeStateOfLoading();

    //in addition to logging in with a password you will retrieve
    //user type for this user and in this case if the user type
    //is equal to driver then let them in else alert you are not a driver


    //email made lowercase because .exists is case sensitive
    var lEmail = email.toLowerCase();

    const dbh = firebase.firestore();
    var docName = dbh.collection("driver-info").doc(lEmail);


    docName.get().then(function (doc) {
      if (doc.exists) {
        firebase.auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            var name = " ";
            var role = "driver";
            var data = doc.data();
            var phoneNumber = data.PhoneNumber;
            console.log(phoneNumber);
            this.props.navigation.navigate("GlobalMap", { name, taxiNumber, role, phoneNumber });
          })
          .catch(function (error) {

            Alert.alert("Password is Incorrect", "Re-enter password and try again")

          }).then(() => this.changeStateOfLoading());

        //add taxi number to database
        return docName.update({
          TaxiNumber: taxiNumber
        }).catch(function (error) {

          Alert.alert("Something Went Wrong Updating Taxi Number", "Ensure information you entered is correct")
          this.props.navigation.navigate('URoles')
        });

      } else {
        this.changeStateOfLoading();
        Alert.alert("You do not have a Driver account", "Have an Admin make an account for you and try again")
      }
    }.bind(this)).catch(function (error) {
      Alert.alert("Something Went Wrong", "Ensure the information you entered is accurate")
      //failsafe needed to stop loop
      this.props.navigation.navigate('URoles')
    }.bind(this));

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

  toggleTaxiNumberError = (bool) => {
    if (bool == 'true') {
      this.setState({
        taxiNumberError: true,
      });
    } else {
      this.setState({

        taxiNumberError: false,
      });
    }

  }

  TitlePicker() {
    //the reason we need this is becasue adjustfontsize only works with ios
    if (Platform.OS == 'android') {
      return (

        <Text style={styles.titleLabel}>Driver Login</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Driver Login</Text>


      );

    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <StatusBar barStyle="dark-content" />

          <Form>
            <Spinner
              //visibility of Overlay Loading Spinner
              visible={this.state.loading}
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

            <Item rounded error={this.state.taxiNumberError ? true : false} style={styles.inputBox}>
              <Icon active name='car' />
              <Input
                placeholder="Taxi Number"
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={(taxiNumber) => this.setState({ taxiNumber })}
              />
            </Item>

            <Item rounded error={this.state.passwordError ? true : false} style={styles.inputBox}>
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

              onPress={() => this.loginUser(this.state.email, this.state.taxiNumber, this.state.password)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  button: {
    marginTop: 30,
    backgroundColor: '#fec33a'

  },
  regularButtonText: {
    color: 'black',
    fontSize: 30
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%"
  },
  titleLabel: {
    fontSize: 40,
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

export default DriverLogin