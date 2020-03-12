//imports for UI - react native attributes, and for firebase functionality
import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';
import * as firebase from 'firebase';
import '@firebase/firestore';

//class AddAdmin
class AddAdmin extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            name: '',
            email: '',
            password: '',
            showPass: true,
            press: false,
            emailError: false,
            nameError: false,
            passwordError: false

        })
    }

    //verifyEmail function to ensure the correct format is entered for email
    verifyEmail = (email) => {
        //let reg = /^([\w -\.] +)@((?: [\w] +\.) +) ([a - zA - Z]{ 2, 4 })$/;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) == false) {
            //console.log("Email address is formated incorrectly");
            Alert.alert("Incorrect Format", "Email address is formated incorrectly")
            return false;
        }
        else {

            return true;
        }
    }

    //ifEmptyToggle function to check if email, name, and password input is blank
    //as this is not allowed
    ifEmptyToggle = (email, name, password) => {
        if (email == '') {

            this.toggleEmailError('true');

        }
        if (name == '') {

            this.toggleNameError('true');

        }


        if (password == '') {

            this.togglePasswordError('true');

        }
    }

    //ifNotEmptyToggle to check if email, name, and password input
    //is filled as it should be completely filled in
    ifNotEmptyToggle = (email, name, password) => {
        if (email != '') {

            this.toggleEmailError('false');

        }

        if (name != '') {

            this.toggleNameError('false');

        }


        if (password != '') {

            this.togglePasswordError('false');

        }

    }

    //checkPassword function to ensure that the password input is longer than 6 characters
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

    //signUpUser function takes name, email, and password input and
    //adds the administrator to the database and redirects to the correct page
    signUpUser = (name, email, password) => {

        try {
            //check that user filled out all fields 
            if (email == '' || password == '' || name == '') {
                this.ifEmptyToggle(email, name, password);
                this.ifNotEmptyToggle(email, name, password);
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

            this.ifNotEmptyToggle(email, name, password);

            //check that password is at least 6 characters
            if (this.checkPassword(password) == false) {
                return;
            }

            //email made lowercase because .exists is case sensitive
            var lEmail = email.toLowerCase();

            if (this.verifyEmail(lEmail) == false) {
                return;
            }

            const dbh = firebase.firestore();
            var docName = dbh.collection("admin-info").doc(lEmail);

            //check if user exists to avoid adding them twice
            docName.get().then(function (doc) {
                if (doc.exists) {
                    Alert.alert("Admin Already Exists", "This email is already being used by another admin")

                } else {
                    Alert.alert("Admin was Added", "This account now has access to the admin functions of this app")
                    dbh.collection("admin-info").doc(lEmail).set({
                        Name: name,
                        Email: lEmail,
                        Type: "Admin"
                    })
                    firebase.auth().createUserWithEmailAndPassword(lEmail, password).catch(function (error) {
                        alert(error);
                        dbh.collection("admin-info").doc(lEmail).delete().catch(function (error) {
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

    //toggleEmailError sets flag for email errors
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

    //toggleNameError sets flag for name errors
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

    //togglePasswordError sets flag for password errors
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

    //showPass hides or unhides when entering the default password to login
    //if the icon within that input box is selected or unselected 
    showPass = () => {
        if (this.state.press == false) {
            this.setState({ showPass: false, press: true })
        } else {
            this.setState({ showPass: true, press: false })
        }
    }

    //TitlePicker function to display title correctly 
    //based on the operating system of the user, driver, 
    //or administrators device
    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>New Admin</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (

                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>New Admin</Text>


            );

        }
    }

    //render method which defines the user interface and askes for 
    //the name, email, and password of the new addministrator being added
    //to the database to create their account 
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


                            onPress={() => this.signUpUser(this.state.name, this.state.email, this.state.password)}
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
                </KeyboardAvoidingView >
            </TouchableWithoutFeedback>
        );


    }

}

//style sheet for the AddAdmin.js page and its components
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

//export AddAdmin.js
export default AddAdmin