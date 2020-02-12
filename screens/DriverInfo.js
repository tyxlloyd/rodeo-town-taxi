import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

import * as firebase from 'firebase';
import '@firebase/firestore';


class DriverInfo extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
      name: '',
      email: '',
      phoneNumber: '',

    })
  }


  navigateToProfile = (name, email, phoneNumber) => {

    this.props.navigation.navigate('DModify', { name, email, phoneNumber })

  }

  render() {
    return (
      <Container style={styles.container}>

        <Form>
          <Label style={styles.titleLabel}>Info of Driver to Modify</Label>

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

          <Item floatingLabel>
            <Label style={styles.label}> Email </Label>
            <Input
              style={styles.textInput}
              autoCorrect={false}
              autoCapitalize="none"
              autoCompleteType="email"
              onChangeText={(email) => this.setState({ email })}
            />
          </Item>

          <Item floatingLabel>
            <Label style={styles.label}> Phone Number </Label>
            <Input
              style={styles.textInput}
              autoCorrect={false}
              autoCapitalize="none"
              autoCompleteType="tel"
              onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
            />
          </Item>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.navigateToProfile(this.state.name, this.state.email, this.state.phoneNumber)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded

            onPress={() => this.props.navigation.navigate('AMain')}
          >
            <Text style={styles.buttonText}>Back</Text>
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
  label: {
    color: 'black'
  },
  textInput: {
    fontSize: 20

  }
});

export default DriverInfo