import React from 'react';
import { StyleSheet, Dimensions, Alert, View, StatusBar } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import io from 'socket.io-client';


const config = require('./config').default

var KEY = config.mapKey;
var SERVER = config.server;

export class DriverMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            region: null,
            destination: null,
            driverLocation: {
                latitude: 47.0085,
                longitude: -120.5291,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045,
            },
            markerVisibility: 1.0, //1.0 for testing
        }

        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        try{
            let { status } = await Permissions.askAsync(Permissions.LOCATION);

            if(status !== 'granted'){
                console.log('Location permission denied.');
            }
                
            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            let region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045,
            }

            let destination = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }

            this.setState({region: region});
            this.setState({destination: destination});
        }
        catch(e){
            console.log('_getLocationAsyncError: ' + e)
        }
    }

    componentDidMount() {
        this.socket = io(SERVER);
        this.socket.on('ride request', request => {
            Alert.alert('You have a new ride request: latitude: ' + request.lat + '\nlongitude: ' + request.long + '\nid: ' + request.id);
            
            let destination = {
                latitude: request.lat,
                longitude: request.long,
            }
            this.setState({destination: destination});
        }),
        this.socket.on('confirmation', message => {
            Alert.alert(message.message);
            this.showDriverLocation(message.driverID);
            //this.setState({markerVisibility: 0.0});
        }),
        this.socket.on('error', message => {
            Alert.alert(message);
        }),
        this.socket.on('queue size', message => {
            var customers = message;
            Alert.alert("Customers in queue: " + customers);
            console.log("Customers in queue: " + customers);
        }),
        this.socket.on('request driver location', message => {
            var response = {
                customerID: message,
                driverLocation: this.state.region,
            }
            this.socket.emit('recieve driver location', response);
        }),
        this.socket.on('request customer location', message => {
            var response = {
                driverID: message.driverID,
                customerLocation: this.state.region,
            }
            this.socket.emit('recieve customer location', response);
        }),
        this.socket.on('recieve driver location', message => {
            this.setState({driverLocation: message});
        }),
        this.socket.on('cancel ride', message => {
            Alert.alert(message);
            this.setState({ destination: this.state.region });
        })
    }

    sendRideRequest(){
        var request = {
            long: this.state.region.longitude,
            lat: this.state.region.latitude,
            id: this.socket.id,
        }
        this.socket.emit('ride request', request);
        Alert.alert("Your request has been sent!");
    }

    receiveRideRequest(){
        this.socket.emit('customer request', this.socket.id);
    }

    showDriverLocation(driverID){
        this.setState({markerVisibility: 1.0});
        var request = {
            customerID: this.socket.id,
            driverID: driverID,
        }
        this.socket.emit('get driver location', request);
        //this.setState({driverLocation: driverLocation});
    }
    

    getSizeOfQueue(){
        this.socket.emit('get queue size', this.socket.id);
        Alert.alert("Getting the queue size...");
        console.log("Getting size of queue...");
    }

      render () {
        return (
            <View style={styles.container}>
                <StatusBar barStyle = "dark-content"/>
                <Header
                    leftComponent={
                        <Icon name={'logout'}
                        size={28}
                          onPress={(() => this.props.navigation.navigate("DLogin"))}/>
                    }
                    rightComponent={
                        <Icon name={'mail'}
                        size={28}
                        onPress={(() => this.props.navigation.navigate("DriverChat"))} />
                    }
                    centerComponent={{ text: 'Rodeo Town Taxi', style: { color: '#000', fontFamily: 'arvo-regular', fontSize: 24 } }}
                    containerStyle={{backgroundColor: '#fec33a'}}
                />
                <MapView
                    style={styles.mapStyle}
                    provider={PROVIDER_GOOGLE} //This line is iOS only! No effect on android. No crash.
                    initialRegion={this.state.region}
                    rotateEnabled={false}
                    showsUserLocation={true}
                    >
                    <Marker
                        coordinate={this.state.driverLocation}
                        opacity={this.state.markerVisibility}
                        image={require('../assets/images/user.png')}
                        pinColor="yellow" //In case image fails to load. Comment the image line to see.
                    />
                    <MapViewDirections
                        origin={this.state.region}
                        destination={this.state.destination}
                        apikey={KEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                   </MapView>
                   <Button
                    title="Request A Customer"
                    onPress={(() => this.receiveRideRequest())}
                    buttonStyle={styles.enabled}
                    titleStyle={styles.buttonText}
                />
                </View>
        )
      }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        flex: 1
    },
    enabled: {
        backgroundColor: '#484848',
        padding: 20
    },
    disabled: {
        backgroundColor:'#484848',
    },
    buttonText: {
        fontSize: 24,
        fontFamily: 'arvo-regular'
    },
    button: {
        backgroundColor: '#484848'
      }
  });
