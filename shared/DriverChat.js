import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Header, Button } from 'react-native-elements';

class DriverChat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: this.props.navigation.getParam('name'),
      taxiNumber: this.props.navigation.getParam('taxiNumber'),
      role: this.props.navigation.getParam('role'),
    }
  }

  navigateToMap(name, taxiNumber, role){
    this.props.navigation.navigate("GlobalMap", {name, taxiNumber, role})
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon name={'back'}
            size={28}
            onPress={(() => this.navigateToMap(this.state.name, this.state.taxiNumber, this.state.role))} />
          }
          centerComponent={{ text: 'Chat Customer', style: { color: '#000', fontSize: 24, fontWeight: 'bold' } }}
          containerStyle={{ backgroundColor: '#fec33a' }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#484848'
  }
});

export default DriverChat;
