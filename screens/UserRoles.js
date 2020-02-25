import React from 'react';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';


class UserRoles extends React.Component {
  TitlePicker() {
    //the reason we need this is becasue adjustfontsize only works with ios
    if (Platform.OS == 'android') {
      return (

        <Text style={styles.titleLabel}>Rodeo Town Taxi</Text>


      );

    } else if (Platform.OS == 'ios') {

      return (

        <Text adjustsFontSizeToFit
          numberOfLines={1} style={styles.titleLabel}>Rodeo Town Taxi</Text>


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

          <View style={styles.imageContainer}>
            <Image
              style={{ width: 310, height: 310 }}
              source={{ uri: 'https://lh3.googleusercontent.com/nkvFLUHasEeoje78Ng9wSbExZRYIMt3XQsKMjwJFRWovKtF4NwDEUvjh7rShPmWOXGmgIrHs0aflfXgkWYdU4pmTgWmMT3nApMrX-3DQlAMTq0sfrCn_PpOZPCVV3TiGc3M4VPrXO7L9Wu0Mi2KyOP8SQc2zsA7SfkYMzFCuQhKnQ2_8a0ogoztyd1L2bTHHaHX9Cru8RlBvdmQUrzYWXEDkGy2FjanPRsyXiBIetKZnFz1plRV6qg1TC0pJDDEByuR7zooDGcVLIz-ATqt720p60MFEbwF_PSjxx9OlnNJahI9SXATraXOYJ4rtavI2ZDR3Y8rJrRDMznAXDMvqShxI2keKM3IbG6XeWdMnTjy7fKSLFbfsLiXLNH0IxsaMwn3Fz5aj0i1oQntGiYwCug4btbJi67wb2vZxX4iWR2VQnjhPmqauiGPPip17Vn-FHkaZKgt3jHkZ9amCns38ilt3DF8JG-Maq5imA67cNeKvncGnVYyDOWI1X8gYEfLdd9m2oWgFALnAjJT7p676SdGL4skT8gPLilxVTAJQmHG1C_uGUrAco571GTAN9qiOGnxiS06zjcyCnYHxYB-3Ff-QwJhzVUB0LUsRoDFZHr7Ha6q4eYTNO5hVHpi_mKeSLNX1OFUprND3MuQU_yJgVgeih7f_oVOUYuXBFjAgze9-_G8QCNrt=w744-h945-no' }}
            />
          </View>

          <View style={styles.buttons}>
            <Button style={styles.button}
              full
              rounded
              light
              onPress={() => this.props.navigation.navigate('CLogin')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.buttonText}>Customer</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded
              light
              onPress={() => this.props.navigation.navigate('DLogin')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.buttonText}>Driver</Text>
            </Button>

            <Button style={styles.button}
              full
              rounded
              light
              onPress={() => this.props.navigation.navigate('ALogin')}
            >
              <Text adjustsFontSizeToFit
                numberOfLines={1} style={styles.buttonText}>Admin</Text>
            </Button>
          </View>


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
    padding: 51
  },
  imageContainer: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:'white'

  },
  buttons: {

    marginTop: 50,
    //backgroundColor:'red'


  },
  titleContainer: {
    flex: 2,
    alignItems: "center",
    marginTop: 10,
    //marginBottom: 30,
    width: "100%",
    //backgroundColor:'blue'

  },
  button: {
    marginTop: 25,


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

export default UserRoles