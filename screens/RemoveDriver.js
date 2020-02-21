import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

import * as firebase from 'firebase';
import '@firebase/firestore';


class RemoveDriver extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            name: '',
            email: '',
            phoneNumber: '',
            password: '',


        })
    }

    removeDriver = async (name, email) => {

        try {
            //check that user filled out all fields 
            if (email == '' || name == '') {
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



            //email made lowercase because .exists is case sensitive
            var lEmail = email.toLowerCase();

            const dbh = firebase.firestore();
            //var docName = dbh.collection("driver-info").doc(lEmail);


            dbh.collection("driver-info").doc(this.state.currentEmail).delete().then(function () {
                //alert("Driver deleted from database")

            }.bind(this)).catch(alert(error));


        } catch (error) {
            console.log(error.toString())
        }
        //requires google chrome on android
        WebBrowser.openBrowserAsync('https://console.firebase.google.com/project/rodeo-town-taxi/authentication/users');


    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <Container style={styles.container}>
                    <StatusBar barStyle="dark-content" />

                    <Form>
                        <Label style={styles.titleLabel}> Remove Driver</Label>

                        <Item floatingLabel>
                            <Label style={styles.label}> Name </Label>
                            <Input
                                style={styles.textInput}
                                autoCorrect={true}
                                autoCapitalize="words"
                                onChangeText={(name) => this.setState({ name })}
                            />
                        </Item>

                        <Item floatingLabel>
                            <Label style={styles.label}> Email </Label>
                            <Input
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
                            <Text style={styles.buttonText}>Remove Driver</Text>
                        </Button>

                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.props.navigation.navigate('AMain')}
                        >
                            <Text style={styles.buttonText}>Done</Text>
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

export default RemoveDriver