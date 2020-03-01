import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';


import * as firebase from 'firebase';
import '@firebase/firestore';


class ForgotPassword extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            email: '',
            emailError: false,


        })
    }

    ifNotEmptyToggle = (email) => {
        if (email != '') {

            this.toggleEmailError('false');

        }
    }

    ifEmptyToggle = (email) => {
        if (email == '') {

            this.toggleEmailError('true');

        }

    }
    resetPassword = (email) => {
        if (email == '') {
            this.ifEmptyToggle(email);
            this.ifNotEmptyToggle(email);

            Alert.alert(
                'Empty Field',
                'Make sure all fields are filled out',
                [
                    { text: 'OK', onPress: () => console.log('') },
                ],
                { cancelable: false },
            );
            return;
        }
        this.ifNotEmptyToggle(email);
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert("Success", "Password reset email has been sent.");
            }, (error) => {
                Alert.alert("Alert", error.message);
            });
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

    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>Reset Password</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (

                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>Reset Password</Text>


            );

        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <Container style={styles.container}>
                    <StatusBar barStyle="dark-content" />

                    <Form>
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


                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.resetPassword(this.state.email)}
                        >
                            <Text adjustsFontSizeToFit
                                numberOfLines={1} style={styles.regularButtonText}>Reset Password</Text>
                        </Button>

                        <Button
                            full
                            transparent
                            rounded

                            onPress={() => this.props.navigation.navigate('URoles')}
                        >
                            <Text adjustsFontSizeToFit
                                numberOfLines={1} style={styles.transparentButtonText}>Back</Text>
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
        padding: 30
    },
    button: {
        marginTop: 50,
        backgroundColor: '#fec33a'

    },
    regularButtonText: {
        color: 'black',
        fontSize: 30
    },
    transparentButtonText: {
        marginTop:20,
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

export default ForgotPassword