//imports for UI - react native attributes, and for firebase functionality
import React from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';
import * as firebase from 'firebase';
import '@firebase/firestore';

//class ModifyDriver
class ModifyDriver extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            currentName: this.props.navigation.getParam('name'),
            currentEmail: this.props.navigation.getParam('email'),
            currentPhoneNumber: this.props.navigation.getParam('phoneNumber'),
            updatedName: '',
            updatedEmail: '',
            updatedPhoneNumber: '',


        })
    }

    //navigate function to go back to AdminMain.js
    navigate = () => {
        this.props.navigation.navigate('AMain')
    }

    //numbersOnly function checks to ensure that only numbers are entered for the phone number
    //and that the max length of the variable is 10 for a valid phone number 
    numbersOnly = (numbers) => {
        let reg = /^[0-9]+$/;
        if (reg.test(numbers) == false || numbers.length != 10) {
            //console.log("Email address is formated incorrectly");
            Alert.alert("Incorrect Format", "Phone numbers should only contain digits without spaces or special characters")
            return false;
        }
        else {

            return true;
        }
    }

    //updateUserInfo takes name, email, and phoneNumber as input and will
    //update the name and phoneNumber of the driver in firebase if no errors are toggled
    updateUserInfo = (name, email, phoneNumber) => {


        if (name == '') {
            name = this.state.currentName
        }
        if (email == '') {
            email = this.state.currentEmail
        }
        if (phoneNumber == '') {
            phoneNumber = this.state.currentPhoneNumber
        }

        //somewhere in here make updated email old email so that the correct values are passed back
        //to customer main

        //email made lowercase because .exists is case sensitive
        var lEmail = email.toLowerCase();

        const dbh = firebase.firestore();
        var docName = dbh.collection("driver-info").doc(lEmail);

        if (this.numbersOnly(phoneNumber) == false) {
            return;
        }

        Alert.alert("Process Complete", "Driver information was updated")

        docName.get().then(function (doc) {
            //If the document does not exist, it will be created. 
            //If the document does exist, its contents will be overwritten with the newly provided data
            dbh.collection("driver-info").doc(lEmail).set({
                Name: name,
                Email: email,
                PhoneNumber: phoneNumber,
                TaxiNumber: "",
                Type: "Driver"
            })


        }.bind(this)).catch(error => alert(error));


        this.setState({
            currentName: name,
            currentPhoneNumber: phoneNumber
        })


    }
    //TitlePicker function to display title correctly 
    //based on the operating system of the user, driver, 
    //or administrators device
    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>Modify Driver</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (

                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>Modify Driver</Text>


            );

        }
    }


    //render method which defines the user interface and askes for 
    //the updated name or phone number of current driver to update
    //their account
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <StatusBar barStyle="dark-content" />

                    <Form>
                        <View style={styles.titleContainer}>
                            {this.TitlePicker()}
                        </View>

                        <Item rounded style={styles.inputBox}>
                            <Icon active name='contact' />

                            <Input
                                placeholder="Name"
                                style={styles.textInput}
                                autoCorrect={true}
                                autoCapitalize="words"
                                autoCompleteType="name"
                                //placeholder={this.state.name}
                                //placeholderTextColor="black"
                                defaultValue={this.state.currentName}
                                //onChangeText={(name) => this.setState({ name })}
                                onChangeText={(updatedName) => this.setState({ updatedName })}


                            />
                        </Item>


                        <Item rounded style={styles.inputBox}>
                            <Icon active name='call' />
                            <Input
                                placeholder="Phone Number"
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize="none"
                                autoCompleteType="tel"
                                keyboardType="numeric"
                                defaultValue={this.state.currentPhoneNumber}
                                //onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                onChangeText={(updatedPhoneNumber) => this.setState({ updatedPhoneNumber })}

                            />
                        </Item>

                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.updateUserInfo(this.state.updatedName, this.state.currentEmail, this.state.updatedPhoneNumber)}
                        >
                            <Text adjustsFontSizeToFit
                                numberOfLines={1} style={styles.regularButtonText}>Update</Text>
                        </Button>

                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.props.navigation.navigate('AMain')}
                        //onPress={() => this.navigateBack(this.state.currentName, this.state.currentEmail, this.state.currentPhoneNumber)}
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

//style sheet for the ModifyDriver.js page and its components
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
    inputBox: {
        marginTop: 30,
        borderColor: 'black',
        //backgroundColor: '#fff',

    },
    textInput: {
        fontSize: 20

    },
    label: {
        color: 'black',
    }
});

//export ModifyDriver.js
export default ModifyDriver