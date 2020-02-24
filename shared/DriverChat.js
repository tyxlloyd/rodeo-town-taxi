import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Header, Button } from 'react-native-elements';

class DriverChat extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon name={'back'}
            size={28}
            onPress={(() => this.props.navigation.navigate("GlobalMap"))} />
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
