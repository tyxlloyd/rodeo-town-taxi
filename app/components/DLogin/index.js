import React, { Component } from 'react';
//import * as React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert

} from 'react-native';
import styles from './styles'

class DLogin extends React.Component {
  state = { username: "", email: "", phoneNumber: "" }

  static navigationOptions = {
    header: null
  }

  checkLogin = () => {
    //if not emtpy navigate
    const { username, email, phoneNumber } = this.state
    if (username != "" && email != "" && phoneNumber != "") {
      this.props.navigation.navigate('DriverMain');
    } else {
      //Alert.alert('Make sure all fields are filled out')
      Alert.alert(
        'Empty Fields',
        'Make sure all fields are filled out',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    }


  }
  render() {
    const { navigate } = this.props.navigation
    return (


      <View style={styles.container}>


        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{'\nLogin'}</Text>
        </View>

        <TextInput placeholder="Name" style={styles.loginInput} onChangeText={text => this.setState({ username: text })} />
        <TextInput placeholder="Phone Number" style={styles.loginInput} onChangeText={text => this.setState({ email: text })} />
        <TextInput placeholder="Driver ID" style={styles.loginInput} />
        <TextInput placeholder="Password" secureTextEntry={true} style={styles.loginInput} onChangeText={text => this.setState({ phoneNumber: text })} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.checkLogin()}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => { navigate('Home'); }}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>


        </View>

      </View>

    );
  }
}


export default DLogin