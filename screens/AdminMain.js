import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';
import * as WebBrowser from 'expo-web-browser';


class AdminMain extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: '',
      name: '',
      phoneNumber: ''
    })
  }


  signOut = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate('URoles')
  }

  viewDriverInfo = async () => {
    const dbh = firebase.firestore();

    dbh.collection("driver-info").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    });

    dbh.collection("admin-info").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

      });
    });
    WebBrowser.openBrowserAsync('https://console.firebase.google.com/project/rodeo-town-taxi/database/firestore/data~2Fdriver-info');
  }

  TitlePicker() {
    //the reason we need this is becasue adjustfontsize only works with ios
    if (Platform.OS == 'android') {
      return (

        <Text style={styles.titleLabel}>Welcome Admin</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Welcome Admin</Text>


      );

    }
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

            onPress={() => this.props.navigation.navigate('AddDriver')}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.buttonText}>Add Driver</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.props.navigation.navigate('DInfo')}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.buttonText}>Modify Driver</Text>
          </Button>
          <Button style={styles.button}
            full
            rounded

            onPress={() => this.props.navigation.navigate('RemoveDriver')}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.buttonText}>Remove Driver</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.viewDriverInfo()}
          //onPress={() => this.props.navigation.navigate('Database')}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.buttonText}>View Database</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded


            onPress={() => this.props.navigation.navigate('AddAdmin')}

          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.buttonText}>Add Admin</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.props.navigation.navigate('RemoveAdmin')}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.buttonText}>Remove Admin</Text>
          </Button>


          <Button style={styles.button}
            full
            rounded

            //onPress={() => this.props.navigation.navigate('ALogin')}
            onPress={() => this.signOut()}
          >
            <Text adjustsFontSizeToFit
              numberOfLines={1} style={styles.buttonText}>Sign Out</Text>
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
    padding: 30
  },
  button: {
    marginTop: 28,
    backgroundColor: '#fec33a'

  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%"
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

export default AdminMain