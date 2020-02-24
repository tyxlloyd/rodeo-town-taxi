import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';

class CustomerLogin extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            name: '',


        })
    }

    loginUser = (name) => {
        //As guest no user information is added to database 
        //if the user wishes to add their information this can be done 
        //in the profile page
        if (name == '') {
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


        this.props.navigation.navigate('CMain', { name })

    }



    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <Container style={styles.container}>
                    <StatusBar barStyle="dark-content" />

                    <Form>
                        <Label style={styles.titleLabel}> Login</Label>

                        <Item floatingLabel>
                            <Label style={styles.label}> Name </Label>
                            <Input
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize="words"
                                autoCompleteType="name"
                                onChangeText={(name) => this.setState({ name })}
                            />
                        </Item>


                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.loginUser(this.state.name)}
                        >
                            <Text style={styles.buttonText}>Log in</Text>
                        </Button>


                        <Button style={styles.button}
                            full
                            rounded

                            onPress={() => this.props.navigation.navigate('CLogin')}
                        >
                            <Text style={styles.buttonText}>Back</Text>
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

export default CustomerLogin