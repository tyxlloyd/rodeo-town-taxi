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

export class CustomerMap extends React.Component {
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
            if (this.state.region === null){
                alert("Unable to find your location automatically. Use the \"call now\""
                + " button on the About page to make a phone call for a taxi.");
                
                //automatically change pages for them. Not working yet. nee jose's table.
                //this.props.navigation.navigate('About');  
            }
        }
    }

    componentDidMount() {
        this.socket = io(SERVER);
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
        if ( this.isNotInRangeFunction() )
        {
            Alert.alert("You are not in range of service!"
                    + " Try calling to see if we can pick you up!");
        }else
        {
            var request = {
                long: this.state.region.longitude,
                lat: this.state.region.latitude,
                id: this.socket.id,
            }
            this.socket.emit('ride request', request);
            Alert.alert("Your request has been sent!");
        }
    }

    //Checks if the GPS location is within range of service.
    //Check if this.state.region is null first.
    isNotInRangeFunction = () => {
    const MAX_NORTHING = 47.141943;
    const MIN_NORTHING = 46.48;
    const MAX_EASTING = -120.331190;
    const MIN_EASTING = -120.756988;
    
    if ( (this.state.region.latitude > MAX_NORTHING)
        || (this.state.region.latitude < MIN_NORTHING))
    {
        return true;
    }
    if ( (this.state.region.longitude > MAX_EASTING) 
            || (this.state.region.longitude < MIN_EASTING) )
    {
        return true;
    }
    
        return false;
    }
    
    
    //Sets location to the middle of Oregon.
    setLocationToOregon = () => {
        let region = {
            latitude: 43.86,
            longitude: -120.0,
            latitudeDelta: 0.045,
            longitudeDelta: 0.045,
        }
        this.setState({region: region});
        
        return "Location set to Oregon.";
    }

    render () {
        return (
            <View>
                <Button
                    title="Request A Ride"
                    onPress={(() => this.sendRideRequest())}
                />
                <Button
                    title = "Load location from GPS again"
                    onPress = { ( () => this._getLocationAsync() ) }
                />
                <Button
                    title = "print location to console"
                    onPress = { ( () => console.log(this.state.region) ) }
                />
                <Button
                    title = "Am I not in range?"
                    onPress = { ( () => alert("Not in range: " + this.isNotInRangeFunction()) ) }
                />
                <Button
                    title = "Set location to Oregon"
                    onPress = { ( () => alert(this.setLocationToOregon())  ) }
                />
                <Button
                    title="Back"
                    onPress={( () => this.props.navigation.navigate("CMain") )}
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
