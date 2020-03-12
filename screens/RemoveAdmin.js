//imports for UI - react native attributes, and for firebase functionality
import React from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import '@firebase/firestore';

//class RemoveAdmin
class RemoveAdmin extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            emailError: false,
            nameError: false


        })
    }

      //ifEmptyToggle function to check if email and password input is blank
  //as this is not allowed
    ifEmptyToggle = (email, name) => {
        if (email == '') {

            this.toggleEmailError('true');

        }
        if (name == '') {

            this.toggleNameError('true');

        }
    }

    //ifNotEmptyToggle to check if email and password input
  //is filled as it should be completely filled in
    ifNotEmptyToggle = (email, name) => {
        if (email != '') {

            this.toggleEmailError('false');

        }

        if (name != '') {

            this.toggleNameError('false');

        }

    }
    //removeDriver takes name, and email as input and will remove the respective
    //administrator if it can verify the information with firebase 
    removeDriver = async (name, email) => {


        //check that user filled out all fields 
        if (email == '' || name == '') {
            this.ifEmptyToggle(email, name);
            this.ifNotEmptyToggle(email, name);
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

        this.ifNotEmptyToggle(email, name);

        try {

            //email made lowercase because .exists is case sensitive
            var lEmail = email.toLowerCase();

            const dbh = firebase.firestore();
            var docName = dbh.collection("admin-info").doc(lEmail);

            docName.get().then(function (doc) {
                if (doc.exists) {
                    //requires google chrome on android
                    WebBrowser.openBrowserAsync('https://console.firebase.google.com/project/rodeo-town-taxi/authentication/users');

                    dbh.collection("admin-info").doc(lEmail).delete().then(function () {


                    }).catch(function (error) {
                        alert(error)

                    });

                } else {
                    Alert.alert("Admin Does Not Exist", "This admin does not exist check email entered and try again")

                }

            }).catch(function (error) {
                alert(error)

            })
        } catch (error) {
            Alert.alert("Something Went Wrong", "Try again")

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
    //TitlePicker function to display title correctly 
    //based on the operating system of the user, driver, 
    //or administrators device
    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>Remove Admin</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (

                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>Remove Admin</Text>


            );

        }
    }


    //render method which defines the user interface and askes for 
    //the name and email of the existing addministrator to delete
    //from the database
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

                        <Button style={styles.button}
                            full
                            rounded
                            onPress={() => this.removeDriver(this.state.name, this.state.email)}
                        >
                            <Text adjustsFontSizeToFit
                                numberOfLines={1} style={styles.regularButtonText}>Remove</Text>
                        </Button>

                        <Button style={styles.button}
                            full
                            rounded

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

//style sheet for the RemoveDriver.js page and its components
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
    buttonText: {
        color: 'black',
        fontSize: 23
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

//export RemoveAdmin.js
export default RemoveAdmin