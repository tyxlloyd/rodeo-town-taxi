import React from 'react';
import { StyleSheet, Text, View, Alert, StatusBar } from 'react-native';
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
    this.props.navigation.navigate('DLogin')
  }

  viewDriverInfo = async () => {
    WebBrowser.openBrowserAsync('https://console.firebase.google.com/project/rodeo-town-taxi/database/firestore/data~2Fdriver-info');
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <Form>
          <Label style={styles.titleLabel}>Welcome Admin</Label>


          <Button style={styles.button}
            full
            rounded
           
            onPress={() => this.props.navigation.navigate('AddDriver')}
          >
            <Text style={styles.buttonText}>Add Driver</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded
           
            onPress={() => this.props.navigation.navigate('DInfo')}
          >
            <Text style={styles.buttonText}>Modify Driver</Text>
          </Button>
          <Button style={styles.button}
            full
            rounded
          
            onPress={() => this.props.navigation.navigate('RemoveDriver')}
          >
            <Text style={styles.buttonText}>Remove Driver</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded
            
            onPress={() => this.viewDriverInfo()}

          >
            <Text style={styles.buttonText}>View Database</Text>
          </Button>



          <Button style={styles.button}
            full
            rounded
            
            //onPress={() => this.props.navigation.navigate('ALogin')}
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
    backgroundColor:'#fec33a'

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

export default AdminMain