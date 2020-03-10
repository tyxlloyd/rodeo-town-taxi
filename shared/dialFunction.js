import { Linking } from 'react-native';

export const dialFunction = () => {
  if (Platform.OS === 'android') {
    Linking.openURL('tel:${5099294222}');
  }
  else {
    Linking.openURL('telprompt:${5099294222}');
  }
}
