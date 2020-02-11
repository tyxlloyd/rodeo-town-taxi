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
var customers = 0;

export class Map extends React.Component {
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
            Alert.alert('You have a new ride request: latitude: ' + request.lat + '\nlongitude: ' + request.long + '\nid: ' + request.id);
            
            let destination = {
                latitude: request.lat,
                longitude: request.long,
            }
            this.setState({destination: destination});
        }),
        this.socket.on('confirmation', message => {
            Alert.alert(message);
        }),
        this.socket.on('error', message => {
            Alert.alert(message);
        }),
        this.socket.on('queue size', message => {
            customers = message;
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

      render () {
        return (
            <View>
                <StatusBar barStyle = "dark-content"/>
                <Header
                    //leftComponent={ <Icon name = 'menu' color = '#000' onPress={(() => navigation.openDrawer())}/>}
                    centerComponent={{ text: 'Rodeo Town Taxi', style: { color: '#000', fontFamily: 'arvo-regular', fontSize: 24 } }}
                    containerStyle={{backgroundColor: '#F7FF00'}}
                />
                <Button
                    title="Request A Ride"
                    onPress={(() => this.sendRideRequest())}
                />
                <Button
                    title="Request A Customer"
                    onPress={(() => this.receiveRideRequest())}
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