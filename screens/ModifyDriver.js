import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';


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

    navigate = () => {
        this.props.navigation.navigate('AMain')
    }

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



        docName.get().then(function (doc) {
            //If the document does not exist, it will be created. 
            //If the document does exist, its contents will be overwritten with the newly provided data
            dbh.collection("driver-info").doc(lEmail).set({
                Name: name,
                Email: email,
                PhoneNumber: phoneNumber,
                Type: "Driver"
            })



        }.bind(this)).catch(error => alert(error));


        this.setState({
            currentName: name,
            currentPhoneNumber: phoneNumber
        })
        Alert.alert("Success","Driver Info was Modified")

    }

    navigateBack = (name, lEmail, phoneNumber) => {
        this.props.navigation.navigate('CMain', { name, lEmail, phoneNumber })
    }


    render() {
        return (
            <Container style={styles.container}>

                <Form>
                    <Label style={styles.titleLabel}> Enter New Info</Label>

                    <Item >
                        <Label style={styles.label}> Name </Label>

                        <Input
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


                    <Item >
                        <Label style={styles.label}> Phone Number </Label>
                        <Input
                            style={styles.textInput}
                            autoCorrect={false}
                            autoCapitalize="none"
                            autoCompleteType="tel"
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
                        <Text style={styles.buttonText}>Update</Text>
                    </Button>

                    <Button style={styles.button}
                        full
                        rounded

                        onPress={() => this.props.navigation.navigate('AMain')}
                    //onPress={() => this.navigateBack(this.state.currentName, this.state.currentEmail, this.state.currentPhoneNumber)}
                    >
                        <Text style={styles.buttonText}>Done</Text>
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
        fontSize: 23
    },
    titleLabel: {
        fontSize: 40,

    },
    textInput: {
        fontSize: 20

    },
    label: {
        color: 'black',
    }
});

export default ModifyDriver