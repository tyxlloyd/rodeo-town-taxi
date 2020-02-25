import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
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

  TitlePicker() {
    //the reason we need this is becasue adjustfontsize only works with ios
    if (Platform.OS == 'android') {
      return (

        <Text style={styles.titleLabel}>Welcome Driver</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Welcome Driver</Text>


      );

    }
  }

  navigateToMap = (taxiNumber) => {
    var name = " ";
    var role = "driver";
    this.props.navigation.navigate("GlobalMap", { name, taxiNumber, role })
  }


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
            onPress={() => this.navigateToMap(this.state.taxiNumber)}
          >
            <Text 
			  adjustsFontSizeToFit
			  numberOfLines={1}
			  style={styles.regularButtonText}>Go To Map</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.signOut()}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.regularButtonText}>Sign Out</Text>
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
  regularButtonText: {
    color: 'black',
    fontSize: 30
  },
  titleLabel: {
    fontSize: 40,

  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%"
  },
  label: {
    color: 'black'
  },
  textInput: {
    fontSize: 20

  }
});

export default DriverMain
