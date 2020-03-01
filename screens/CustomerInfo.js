import React from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';


class AdminLogin extends React.Component {

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


        //email made lowercase because .exists is case sensitive
        var lEmail = email.toLowerCase();



        const dbh = firebase.firestore();
        var docName = dbh.collection("customer-info").doc(lEmail);



        docName.get().then(function (doc) {
            //If the document does not exist, it will be created. 
            //If the document does exist, its contents will be overwritten with the newly provided data
            dbh.collection("customer-info").doc(lEmail).set({
                Name: name,
                Email: email,
                PhoneNumber: phoneNumber,
                Type: "Customer"
            })

        }.bind(this)).catch(error => alert(error)).then(Alert.alert("Process Complete", "Your account has been updated"));

        //if currentEmail != updatedEmail delete old document
        if (lEmail != this.state.currentEmail) {
            console.log(lEmail)
            console.log(this.state.currentEmail)
            dbh.collection("customer-info").doc(this.state.currentEmail).delete().then(function () {


            }.bind(this)).catch(error => alert(error));
        }

        this.setState({
            currentName: name,
            currentEmail: lEmail,
            currentPhoneNumber: phoneNumber
        })

    }


    navigateBack = (name, lEmail, phoneNumber) => {
        this.props.navigation.navigate('CMain', { name, lEmail, phoneNumber })
    }

    deleteAccount = (email) => {
        try {

            //email made lowercase because .exists is case sensitive
            var lEmail = email.toLowerCase();

            const dbh = firebase.firestore();
            //var docName = dbh.collection("driver-info").doc(lEmail);


            dbh.collection("customer-info").doc(lEmail).delete().then(function () {


            }.bind(this)).catch(alert(error));


        } catch (error) {
            console.log(error.toString())
        }
        Alert.alert("Process Complete", "Your account has been deleted")

        this.props.navigation.navigate('URoles')
    }

    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>Profile</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (

                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>Profile</Text>


            );

        }
    }
    render() {
        return (
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
                        <Icon active name='mail' />
                        <Input
                            placeholder="Email"
                            style={styles.textInput}
                            autoCorrect={true}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            defaultValue={this.state.currentEmail}
                            //onChangeText={(email) => this.setState({ email })}
                            onChangeText={(updatedEmail) => this.setState({ updatedEmail })}

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
                            defaultValue={this.state.currentPhoneNumber}
                            //onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                            onChangeText={(updatedPhoneNumber) => this.setState({ updatedPhoneNumber })}

                        />
                    </Item>

                    <Button style={styles.button}
                        full
                        rounded

                        onPress={() => this.updateUserInfo(this.state.updatedName, this.state.updatedEmail, this.state.updatedPhoneNumber)}
                    >
                        <Text adjustsFontSizeToFit
                            numberOfLines={1} style={styles.regularButtonText}>Save</Text>
                    </Button>

                    <Button style={styles.button}
                        full
                        rounded

                        //onPress={() => this.props.navigation.navigate('CMain')}
                        onPress={() => this.navigateBack(this.state.currentName, this.state.currentEmail, this.state.currentPhoneNumber)}
                    >
                        <Text adjustsFontSizeToFit
                            numberOfLines={1} style={styles.regularButtonText}>Back</Text>
                    </Button>

                    <Button
                        full
                        rounded
                        transparent
                        //onPress={() => this.props.navigation.navigate('CMain')}
                        onPress={() => this.deleteAccount(this.state.currentEmail)}
                    >
                        <Text adjustsFontSizeToFit
                            numberOfLines={1} style={styles.transparentButtonText}>Delete Account</Text>
                    </Button>


                </Form>
            </KeyboardAvoidingView>
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

export default AdminLogin