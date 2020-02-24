import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Header} from 'react-native-elements';


class CustomerChat extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon name={'back'}
            size={28}
            onPress={(() => this.props.navigation.navigate("DriverMap"))} />
          }
          centerComponent={{ text: 'Chat Driver', style: { color: '#000', fontSize: 24, fontWeight: 'bold' } }}
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

export default CustomerChat;