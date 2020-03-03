import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';


class AddDriver extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            showPass: true,
            press: false,
            emailError: false,
            nameError: false,
            phoneNumberError: false,
            passwordError: false,


        })
    }

    verifyEmail = (email) => {
        //let reg = /^([\w -\.] +)@((?: [\w] +\.) +) ([a - zA - Z]{ 2, 4 })$/;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if (reg.test(email) == false) {
            //console.log("Email address is formated incorrectly");
            Alert.alert("Incorrect Format", "Email address is formated incorrectly")
            return false;
        }
        else {

            return true;
        }
    }
    ifEmptyToggle = (email, name, phoneNumber, password) => {
        if (email == '') {

            this.toggleEmailError('true');

        }
        if (name == '') {

            this.toggleNameError('true');

        }

        if (phoneNumber == '') {

            this.togglePhoneNumberError('true');

        }

        if (password == '') {

            this.togglePasswordError('true');

        }
    }

    ifNotEmptyToggle = (email, name, phoneNumber, password) => {
        if (email != '') {

            this.toggleEmailError('false');

        }

        if (name != '') {

            this.toggleNameError('false');

        }

        if (phoneNumber != '') {

            this.togglePhoneNumberError('false');

        }

        if (password != '') {

            this.togglePasswordError('false');

        }

    }

    checkPassword = (password) => {
        if (this.state.password.length < 6) {
            Alert.alert(
                'Password is too Short',
                'Make sure password is at least 6 characters long',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
            return false;
        } else {
            return true;
        }
    }

    numbersOnly = (numbers) => {
        let reg = /^[0-9]+$/;
        if (reg.test(numbers) == false || numbers.length != 10) {
            //console.log("Email address is formated incorrectly");
            Alert.alert("Incorrect Format", "Phone numbers should only contain 10 digits without spaces or special characters")
            return false;
        }
        else {

            return true;
        }
    }
    signUpUser = (name, email, password, phoneNumber) => {

        try {
            //check that user filled out all fields 
            if (email == '' || password == '' || name == '' || phoneNumber == '') {

                this.ifEmptyToggle(email, name, phoneNumber, password);
                this.ifNotEmptyToggle(email, name, phoneNumber, password);
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

            this.ifNotEmptyToggle(email, name, phoneNumber, password);

            if (this.numbersOnly(phoneNumber) == false) {
                return;
            }

            //check that password is at least 6 characters
            if (this.checkPassword(password) == false) {
                return;
            }


            //add user to authentication and database

            //email made lowercase because .exists is case sensitive
            var lEmail = email.toLowerCase();

            if (this.verifyEmail(lEmail) == false) {
                return;
            }

            const dbh = firebase.firestore();
            var docName = dbh.collection("driver-info").doc(lEmail);

            //check if user exists to avoid adding them twice
            docName.get().then(function (doc) {
                if (doc.exists) {
                    Alert.alert("Driver Already Exists", "Another driver is already using this email")

                } else {
                    Alert.alert("Driver was Added", "This account now has access to the driver functions of this app")
                    dbh.collection("driver-info").doc(lEmail).set({
                        Name: name,
                        Email: lEmail,
                        PhoneNumber: phoneNumber,
                        TaxiNumber: '',
                        Type: "Driver"
                    })
                    firebase.auth().createUserWithEmailAndPassword(lEmail, password).catch(function (error) {
                        alert(error);
                        dbh.collection("driver-info").doc(lEmail).delete().catch(function (error) {
                            alert(error)
                        });

                    })

                }
            }.bind(this)).catch(function (error) {
                alert(error)

            });



        } catch (error) {
            Alert.alert("Something Went Wrong", "Try again ");
            this.props.navigation.navigate('AMain')
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
    showPass = () => {
        if (this.state.press == false) {
            this.setState({ showPass: false, press: true })
        } else {
            this.setState({ showPass: true, press: false })
        }
    }

    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>New Driver</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (

                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>New Driver</Text>


            );

        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
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
                                autoCorrect={true}
                                autoCapitalize="words"
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
                                keyboardType="numeric"
                                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
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


                            onPress={() => this.signUpUser(this.state.name, this.state.email, this.state.password, this.state.phoneNumber)}
                        >
                            <Text adjustsFontSizeToFit
                                numberOfLines={1} style={styles.regularButtonText}>Add</Text>
                        </Button>

                        <Button style={styles.button}
                            full
                            rounded
                            transparent

                            onPress={() => this.props.navigation.navigate('AMain')}
                        >
                            <Text adjustsFontSizeToFit
                                numberOfLines={1} style={styles.regularButtonText}>Done</Text>
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

export default AddDriver