import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';

class UserRoles extends React.Component {

  render() {
    return (
      <Container style={styles.container}>

        <Form>
          <Text style={styles.titleLabel}> Rodeo Town Taxi</Text>


          <Button style={styles.button}
            full
            rounded
            light
            onPress={() => this.props.navigation.navigate('CLogin')}
          >
            <Text style={styles.buttonText}>Customer</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded
            light
            onPress={() => this.props.navigation.navigate('DLogin')}
          >
            <Text style={styles.buttonText}>Driver</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded
            light
            onPress={() => this.props.navigation.navigate('ALogin')}
          >
            <Text style={styles.buttonText}>Admin</Text>
          </Button>

        </Form>
      </Container>
    );


  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fec33a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  button: {
    marginTop: 50,


  },
  buttonText: {
    color: 'black',
    fontSize: 25
  },
  titleLabel: {
    fontSize: 45,

  },

  label: {
    color: 'black'
  },
  textInput: {
      fontSize: 20

  }
});

export default UserRoles