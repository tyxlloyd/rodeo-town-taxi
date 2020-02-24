import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';


class DriverMain extends React.Component {
  constructor(props) {
    super(props)

    this.state = ({
      email: this.props.navigation.getParam('email'),
      taxiNumber: this.props.navigation.getParam('taxiNumber'),
    })
  }

  signOut = () => {

    var lEmail = this.state.email.toLowerCase();
    const dbh = firebase.firestore();
    var docName = dbh.collection("driver-info").doc(lEmail);

    //remove taxi number from database and sign out
    docName.get().then(function (doc) {
      if (doc.exists) {

        return docName.update({
          TaxiNumber: ''
        }).catch(error => Alert.alert("Error", error));
      }
    }.bind(this)).catch(error => alert(error));

    firebase.auth().signOut();
    this.props.navigation.navigate('DLogin')
  }

  navigateToMap = (taxiNumber) => {
    var name = " ";
    var role = "driver";
    this.props.navigation.navigate("GlobalMap", { name, taxiNumber, role })
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <Form>
          <Label style={styles.titleLabel}> Welcome Driver</Label>

          <Button style={styles.button}
            full
            rounded
            onPress={() => this.navigateToMap(this.state.taxiNumber)}
          >
            <Text style={styles.buttonText}>Go To Map</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.signOut()}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
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
    alignItems: 'center',
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

export default DriverMain