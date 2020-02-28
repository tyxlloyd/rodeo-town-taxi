import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import * as firebase from 'firebase';
import '@firebase/firestore';

class CustomerLogin extends React.Component {
    mounted = false;
    constructor(props) {
        super(props)

        this.state = ({
            name: '',
            loading: false,
            nameError: false,


        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    changeStateOfLoading = () => {
        if (this.mounted) {
            this.setState({

                loading: !this.state.loading,
            });
        }


    }
    ifEmptyToggle = (name) => {
        if (name == '') {

            this.toggleNameError('true');

        }
    }

    ifNotEmptyToggle = (name) => {

        if (name != '') {

            this.toggleNameError('false');

        }

    }
    loginUser = (name) => {
        //As guest no user information is added to database 
        //if the user wishes to add their information this can be done 
        //in the profile page
        if (name == '') {
            this.ifEmptyToggle(name);
            this.ifNotEmptyToggle(name);
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
        this.ifNotEmptyToggle(name);

        var taxiNumber = 0;
        var role = "customer";
        this.props.navigation.navigate("GlobalMap", { name, taxiNumber, role })

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

    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>Login as Customer</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (


                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>Login as Customer</Text>


            );

        }
    }


    render() {
        return (
            <Container style={styles.container}>

                <Form>
                    <Spinner
                        //visibility of Overlay Loading Spinner
                        visible={this.state.loading}
                        //Text with the Spinner
                        //textContent={'Loading...'}
                        //Text style of the Spinner Text
                        textStyle={styles.spinnerTextStyle}
                    />
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


                    <Button style={styles.button}
                        full
                        rounded

                        onPress={() => this.loginUser(this.state.name)}
                    >
                        <Text adjustsFontSizeToFit
                            numberOfLines={1} style={styles.regularButtonText}>Log in</Text>
                    </Button>


                    <Button
                        full
                        rounded
                        transparent
                        onPress={() => this.props.navigation.navigate('CLogin')}
                    >
                        <Text adjustsFontSizeToFit
                            numberOfLines={1} style={styles.transparentButtonText}>Back</Text>
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
        color: 'black',
        fontSize: 15
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
        //marginTop: 30,
        borderColor: 'black',
        //backgroundColor: '#fff',

    },
    textInput: {
        fontSize: 20

    }
});

export default CustomerLogin