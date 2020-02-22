import React from 'react';
import { StyleSheet, Dimensions, Alert, View, StatusBar } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import io from 'socket.io-client';

const config = require('./config').default

var KEY = config.mapKey;
var SERVER = config.server;

export class CustomerMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.navigation.getParam('name'),
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            },
            destination: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            },
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
        this._getPermissionAsync();
    }

    _getPermissionAsync = async () => {
        try {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);

            if (status !== 'granted') {
                console.log('Location permission denied.');
            }
        }

        catch (e) {
            console.log('_getLocationAsyncError: ' + e)
        }
    }

    componentDidMount() {
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

                this.setState({region: lastRegion});
                if(this.state.driverID != null){
                    var response = {
                        driverID: this.state.driverID,
                        customerLocation: this.state.region,
                    }
                    this.socket.emit('recieve customer location', response);
                }
        }, (error) => { console.log(error.message) },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, }
        );
        this.socket = io(SERVER);
        this.socketListener();
    }

    socketListener(){
        this.socket.on('ride request', request => {
            Alert.alert('You have a new ride request: latitude: ' + request.lat + '\nlongitude: ' + request.long + '\nid: ' + request.id);

            let destination = {
                latitude: request.lat,
                longitude: request.long,
            }
            this.setState({ destination: destination });
        }),

        this.socket.on('confirmation', message => {
            Alert.alert("Your taxi is on the way!", "Cab #" + message.taxiNumber + " is on its way to pick you up!");
            this.showDriverLocation(message.driverID);
            this.setState({ markerVisibility: 1.0 });
            this.setState({ driverID: message.driverID });
            this.setState({ driverAcceptedRequest: true });
            this.setState({ buttonTitle: "Cancel Request" });
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
            this.setState({ driverLocation: message });
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

    pressHandler(){
        if(this.state.requestSent == false){
            this.sendRideRequest();
        }
        else{
            this.cancelRideRequest();
        }
    }

    sendRideRequest() {
        console.log('new request:');
        var request = {
            name: this.state.name,
            long: this.state.region.longitude,
            lat: this.state.region.latitude,
            id: this.socket.id,
        }
        console.log("lat: " + request.lat);
        console.log("long: " + request.long);
        this.socket.emit('ride request', request);
        Alert.alert("Your request has been sent!",
            "Please do not turn off your phone or close the app or you will lose your spot in line." );
        this.setState({ buttonTitle: "Finding a driver..." });
        this.setState({ requestSent: true });
    }

    cancelRideRequest(){
        if(this.state.driverID == null){
            Alert.alert("Please be patient", 
                "Your request will be processed in the order it was recieved. Please do not turn off your phone or close the app. You will lose your spot in line if you do.");
        }
        else{
            this.socket.emit('cancel ride request', this.state.driverID);
            this.setState({ driverID: null });
            this.setState({ markerVisibility: 0.0 });
            this.setState({ driverAcceptedRequest: false });
            this.setState({ buttonTitle: "Hail A Cab" });
            this.setState({ requestSent: false });
            Alert.alert("You have cancelled your ride request!");
        }
    }

    receiveRideRequest() {
        this.socket.emit('customer request', this.socket.id);
    }

    showDriverLocation(driverID) {
        var request = {
            customerID: this.socket.id,
            driverID: driverID,
        }
        this.socket.emit('get driver location', request);
        //this.setState({driverLocation: driverLocation});
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <Header
                    //leftComponent={ <Icon name = 'menu' color = '#000' onPress={(() => navigation.openDrawer())}/>}
                    centerComponent={{ text: 'Rodeo Town Taxi', style: { color: '#000', fontFamily: 'arvo-regular', fontSize: 24 } }}
                    containerStyle={{ backgroundColor: '#F7FF00' }}
                />
                <MapView
                    style={styles.mapStyle}
                    provider={MapView.PROVIDER_GOOGLE}
                    region={this.state.region}
                    rotateEnabled={false}
                    showsUserLocation={true}
                >
                    <MapView.Marker
                        coordinate={this.state.driverLocation}
                        opacity={this.state.markerVisibility}
                        //<Image source={require('../assets/images/user.png')} style={{ height: 35, width: 35 }} />
                    />
                    {/*
                    <MapViewDirections
                        origin={this.state.region}
                        destination={this.state.destination}
                        apikey={KEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                    */}
                </MapView>
                <Button
                    title={this.state.buttonTitle}
                    onPress={(() => this.pressHandler())}
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