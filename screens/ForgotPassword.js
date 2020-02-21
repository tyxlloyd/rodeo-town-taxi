import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';


import * as firebase from 'firebase';
import '@firebase/firestore';


class ForgotPassword extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            email: '',


        })
    }


    resetPassword = (email) => {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert("Success", "Password reset email has been sent.");
            }, (error) => {
                Alert.alert("Alert",error.message);
            });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <Container style={styles.container}>
                    <StatusBar barStyle="dark-content" />

                    <Form>
                        <Label style={styles.titleLabel}>Reset Password</Label>
                        <Item floatingLabel>
                            <Label style={styles.label}> Email </Label>
                            <Input
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize="none"
                                autoCompleteType="email"
                                onChangeText={(email) => this.setState({ email })}
                            />
                        </Item>


                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.resetPassword(this.state.email)}
                        >
                            <Text style={styles.buttonText}>Reset Password</Text>
                        </Button>

                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.props.navigation.navigate('URoles')}
                        >
                            <Text style={styles.buttonText}>Home</Text>
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

export default ForgotPassword