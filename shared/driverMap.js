import React from 'react';
import { StyleSheet, Dimensions, Alert, View, StatusBar } from 'react-native';
import { Header, Icon, Button, Image } from 'react-native-elements';
import MapView from 'react-native-maps';
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
            taxiNumber: this.props.navigation.getParam('taxiNumber'),
            region: null,
            destination: null,
            driverLocation: {
                latitude: 47.0085,
                longitude: -120.5291,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045,
            },
            markerVisibility: 0.0,
            driverAcceptedRequest: false,
            driverID: null,
            requestSent: false,
            buttonTitle: "Hail A Cab",
        }
        console.log(this.state.taxiNumber)
    }

    componentDidMount() {
        //this.setState({driverLocation: this.state.region});
        this.watchID = navigator.geolocation.watchPosition((position) => {
            console.log('reached')
            var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)

            var lastRegion = {
                latitude: lat,
                longitude: long,
                longitudeDelta: 0.045,
                latitudeDelta: 0.045
            }

            this.setState({region: lastRegion})
        }, (error) => { console.log(error.message) },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, }
        );
        this.socket = io(SERVER);
        this.socket.on('ride request', request => {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + request.lat + ',' + request.long + '&key=' + KEY)
            .then((response) => response.json())
            .then((responseJson) => {
                Alert.alert('You have a new ride request!', request.name + " is waiting for you at:\n" + responseJson.results[0].formatted_address);
                //Alert.alert('You have a new ride request: ' + JSON.stringify(responseJson));
            });
            //Alert.alert('You have a new ride request: latitude: ' + request.lat + '\nlongitude: ' + request.long + '\nid: ' + request.id);
            
            let destination = {
                latitude: request.lat,
                longitude: request.long,
            }
            this.setState({destination: destination});
            this.setState({driverLocation: destination});
            this.setState({markerVisibility: 1.0});
        }),
        this.socket.on('confirmation', message => {
            Alert.alert("Your taxi is on the way!", "Cab #" + message.taxiNumber + " is on its way to pick you up!");
            this.showDriverLocation(message.driverID);
            //this.setState({markerVisibility: 0.0});
        }),
        this.socket.on('error', message => {
            Alert.alert(message);
        }),
        this.socket.on('queue size', message => {
            customers = message;
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
            this.setState({ markerVisibility: 0.0 });
        })
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID)
    }

    sendRideRequest() {
        console.log('new request:');
        var request = {
            long: this.state.region.longitude,
            lat: this.state.region.latitude,
            id: this.socket.id,
        }
        console.log("lat: " + request.lat);
        console.log("long: " + request.long);
        this.socket.emit('ride request', request);
        Alert.alert("Your request has been sent!");
        this.setState({ buttonTitle: "Cancel Request" });
        this.setState({ requestSent: true });
    }

    receiveRideRequest(){
        var request= {
            taxiNumber: this.state.taxiNumber,
            id: this.socket.id,
        }
        this.socket.emit('customer request', request);
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

      render () {
        return (
            <View style={styles.container}>
                <StatusBar barStyle = "dark-content"/>
                <Header
                    //leftComponent={ <Icon name = 'menu' color = '#000' onPress={(() => navigation.openDrawer())}/>}
                    centerComponent={{ text: 'Rodeo Town Taxi', style: { color: '#000', fontFamily: 'arvo-regular', fontSize: 24 } }}
                    containerStyle={{backgroundColor: '#F7FF00'}}
                />
                <MapView
                    style={styles.mapStyle}
                    provider={MapView.PROVIDER_GOOGLE}
                    initialRegion={this.state.region}
                    rotateEnabled={false}
                    showsUserLocation={true}
                    >
                    <MapView.Marker
                        coordinate={this.state.driverLocation}
                        opacity={this.state.markerVisibility}
                        //<Image source={require('../assets/images/user.png')} style={{ height: 35, width: 35 }} />
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
    }
  });