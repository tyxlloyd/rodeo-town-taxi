import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';


class AddDriver extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            name: '',
            email: '',
            phoneNumber: '',
            password: ''

        })
    }


    signUpUser = (name, email, password, phoneNumber) => {

        try {
            //check that user filled out all fields 
            if (email == '' || password == '' || name == '') {
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
            //check that password is at least 6 characters
            if (this.state.password.length < 6) {
                Alert.alert(
                    'Password is too short',
                    'Make sure password is at least 6 characters long',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
                return;
            }
            //add user to authentication and database

            //email made lowercase because .exists is case sensitive
            var lEmail = email.toLowerCase();

            const dbh = firebase.firestore();
            var docName = dbh.collection("driver-info").doc(lEmail);

            //check if user exists to avoid adding them twice
            docName.get().then(function (doc) {
                if (doc.exists) {
                    alert("Driver already exists ")
                   
                } else {
                    dbh.collection("driver-info").doc(lEmail).set({
                        Name: name,
                        Email: lEmail,
                        PhoneNumber: phoneNumber,
                        TaxiNumber:'',
                        Type: "Driver"
                    })
                    firebase.auth().createUserWithEmailAndPassword(lEmail, password).catch(error => alert(error))
                    Alert.alert("Success","Driver was added ")
                }
            }.bind(this)).catch(alert(error));



        } catch (error) {
            console.log(error.toString())
        }
    }

    render() {
        return (
            <Container style={styles.container}>

                <Form>
                    <Label style={styles.titleLabel}> New Driver</Label>

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

                    <Item floatingLabel>
                        <Label style={styles.label}> Phone Number </Label>
                        <Input
                            style={styles.textInput}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                        />
                    </Item>

                    <Item floatingLabel>
                        <Label style={styles.label}> Password </Label>
                        <Input
                            style={styles.textInput}
                            secureTextEntry={true}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={(password) => this.setState({ password })}
                        />
                    </Item>

                    <Button style={styles.button}
                        full
                        rounded


                        onPress={() => this.signUpUser(this.state.name, this.state.email, this.state.password, this.state.phoneNumber)}
                    >
                        <Text style={styles.buttonText}>Add</Text>
                    </Button>

                    <Button style={styles.button}
                        full
                        rounded

                        onPress={() => this.props.navigation.navigate('AMain')}
                    >
                        <Text style={styles.buttonText}>Back</Text>
                    </Button>

                </Form>
            </Container>
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
        fontSize: 25
    },
    titleLabel: {
        fontSize: 45,

    },
    label: {
        color: 'black'
    },
    textInput: {
        fontSize: 20

    }
});

export default AddDriver