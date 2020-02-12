import React from 'react';
import { StyleSheet, Dimensions, Alert, View } from 'react-native';
import { Button } from 'react-native-elements';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import io from 'socket.io-client';

const config = require('./config').default
var KEY = config.mapKey;
var SERVER = config.server;
var customers = 0;
var amIRequested = false;

export class DriverMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            region: null,
            destination: null,
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
            Alert.alert('You have a new ride request: latitude: ' 
                    + request.lat + '\nlongitude: ' + request.long 
                    + '\nid: ' + request.id);
            
            let destination = {
                latitude: request.lat,
                longitude: request.long,
            }
            this.setState({destination: destination});
            console.log("Destination coordinates: " 
                    + destination.latitude + " N  "
                    + destination.longitude + " E");
            amIRequested = true;
        }),
        this.socket.on('confirmation', message => {
            Alert.alert(message);
        }),
        this.socket.on('error', message => {
            Alert.alert(message);
        }),
        this.socket.on('queue size', message => {
            customers = message;
            Alert.alert("Customers in queue: " + customers);
            console.log("Customers in queue: " + customers);
        })
    }


    receiveRideRequest(){
        if (amIRequested){
            Alert.alert("You already have a ride request!");
        }
        else{
            this.socket.emit('customer request', this.socket.id);
        }
    }
    
    clearAmIRequestedFlag(){
        amIRequested = false;
        Alert.alert("amIRequested flag set to false");
    }
    
    
    getSizeOfQueue(){
        this.socket.emit('get queue size', this.socket.id);
        Alert.alert("Getting the queue size...");
        console.log("Getting size of queue...");
    }

    render () {
        return (
            <View>
                <Button
                    title="Get size of queue"
                    onPress={(() => this.getSizeOfQueue())}
                />
                <Button
                    title="Request A Customer"
                    onPress={(() => this.receiveRideRequest())}
                />
                <Button
                    title = "Clear Ride Request"
                    onPress={(() => this.clearAmIRequestedFlag())}
                />
                <Button
                    title="Back"
                    onPress={( () => this.props.navigation.navigate("DMain") )}
                />
                <MapView
                    style={styles.mapStyle}
                    provider={MapView.PROVIDER_GOOGLE}
                    initialRegion={this.state.region}
                    rotateEnabled={false}
                    showsUserLocation={true}
                >
                <MapViewDirections
                    origin={this.state.region}
                    destination={this.state.destination}
                    apikey={KEY}
                    strokeWidth={3}
                    strokeColor="hotpink"
                />
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },

    button: {
        position: 'absolute',
        bottom:1000
      },

  });
