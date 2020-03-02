import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';

class CustomerLogin extends React.Component {
    mounted = false;
    constructor(props) {
        super(props)

        this.state = ({
            name: '',
            phoneNumber: '',
            loading: false,
            nameError: false,
            phoneNumberError: false,


        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    ifEmptyToggle = (name, phoneNumber) => {
        if (name == '') {

            this.toggleNameError('true');

        }

        if (phoneNumber == '') {

            this.togglePhoneNumberError('true');

        }

    }

    ifNotEmptyToggle = (name, phoneNumber) => {
        if (name != '') {

            this.toggleNameError('false');

        }

        if (phoneNumber != '') {

            this.togglePhoneNumberError('false');

        }

    }
    loginUser = (name, phoneNumber) => {
        //As guest no user information is added to database 
        //if the user wishes to add their information this can be done 
        //in the profile page
        if (name == '' || phoneNumber == '') {
            this.ifEmptyToggle(name, phoneNumber);
            this.ifNotEmptyToggle(name, phoneNumber);
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
        this.mounted = true;
        this.ifNotEmptyToggle(name, phoneNumber);
        var taxiNumber = 0;
        var role = "customer";
        console.log("Customer: " + phoneNumber);
        this.props.navigation.navigate("GlobalMap", { name, taxiNumber, role, phoneNumber })

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

    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>Customer Login</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (


                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>Customer Login</Text>


            );

        }
    }


    render() {
        return (
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <Container style={styles.container}>
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
                                autoCorrect={false}
                                autoCapitalize="words"
                                autoCompleteType="name"
                                onChangeText={(name) => this.setState({ name })}
                            />
                        </Item>

                        <Item rounded error={this.state.phoneNumberError ? true : false} style={styles.inputBox}>
                            <Icon active name='call' />
                            <Input
                                placeholder="Phone Number"
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize="none"
                                autoCompleteType="tel"
                                keyboardType="numeric"
                                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                            />
                        </Item>

                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.loginUser(this.state.name, this.state.phoneNumber)}
                        >
                            <Text adjustsFontSizeToFit
                                numberOfLines={1} style={styles.regularButtonText}>Log in</Text>
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
        marginTop: 45,
        backgroundColor: '#fec33a'

    },
    regularButtonText: {
        color: 'black',
        fontSize: 30
    },
    transparentButtonText: {
        marginTop: 20,
        color: 'black',
        fontSize: 22
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: 50,
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

export default CustomerLogin