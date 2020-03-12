//imports for UI - react native attributes, and for firebase functionality
import React from 'react';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';
import { TextInput } from 'react-native-gesture-handler';

//class Database
class Database extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            adminInfo: '',
            driverInfo: ''
        })
    }
    //TitlePicker function to display title correctly 
    //based on the operating system of the user, driver, 
    //or administrators device
    TitlePicker() {
        //the reason we need this is becasue adjustfontsize only works with ios
        if (Platform.OS == 'android') {
            return (

                <Text style={styles.titleLabel}>Database</Text>


            );

        } else if (Platform.OS == 'ios') {

            return (

                <Text adjustsFontSizeToFit
                    numberOfLines={1} style={styles.titleLabel}>Database</Text>


            );

        }
    }

    //viewDatabaseInfo shows all drivers currently in the database
    viewDatabaseInfo = () => {
        const dbh = firebase.firestore();

        dbh.collection("driver-info").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                this.setState({ driverInfo: 'My Changed Text' });
                return doc.data();
            });
        }).catch(error => alert(error));

        dbh.collection("admin-info").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, "=>", doc.data());
                this.setState({ adminInfo: 'My Changed Text' });


            });
        }).catch(error => alert(error));
        //WebBrowser.openBrowserAsync('https://console.firebase.google.com/project/rodeo-town-taxi/database/firestore/data~2Fdriver-info');
    }

    //render method which defines the user interface and shows all of the
    //current drivers that are able to login to use the app as a driver
    render() {
        return (
            <Container style={styles.container}>

                <Form>
                    <View style={styles.titleContainer}>
                        {this.TitlePicker()}
                    </View>


                    <Button style={styles.button}
                        full
                        rounded
                        light
                        onPress={() => this.viewDatabaseInfo()}
                    >
                        <Text adjustsFontSizeToFit
                            numberOfLines={1} style={styles.buttonText}>View </Text>
                    </Button>

                    <Button style={styles.button}
                        full
                        rounded
                        light
                        onPress={() => this.props.navigation.navigate('AMain')}
                    >
                        <Text adjustsFontSizeToFit
                            numberOfLines={1} style={styles.buttonText}>Back</Text>
                    </Button>


                </Form>
            </Container>
        );


    }

}

//style sheet for the Database.js page and its components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 51
    },
    imageContainer: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor:'white'

    },
    buttons: {

        marginTop: 50,
        //backgroundColor:'red'


    },
    titleContainer: {
        flex: 2,
        alignItems: "center",
        marginTop: 10,
        //marginBottom: 30,
        width: "100%",
        //backgroundColor:'blue'

    },
    button: {
        marginTop: 25,


    },
    buttonText: {
        color: 'black',
        fontSize: 30
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
//export Database.js
export default Database