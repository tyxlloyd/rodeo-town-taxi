import React from 'react';
import { StyleSheet, Dimensions, Alert, View } from 'react-native';
import { Button, Image } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import io from 'socket.io-client';

const config = require('./config').default

var KEY = config.mapKey;
var SERVER = config.server;

export class userMap extends React.Component {
    constructor(props) {
        super(props);

        this._getLocationAsync();

        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }
        }
    }
    handleLocation = () => {
        this.watchID = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    coordinate:this.state.region
                });
            },
            { enableHighAccuracy: true}
        )
    }

    _getLocationAsync = async () => {
        try {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);

            if (status !== 'granted') {
                console.log('Location permission denied.');
            }
            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            let region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045,
            }

            this.setState({ region: region });
        }
        catch (e) {
            console.log('_getLocationAsyncError: ' + e)
        }
    }

    componentDidMount() {
        this.socket = io(SERVER);
        this.socket.on('ride request', request => {
            Alert.alert(request);
        })
    }

    sendRideRequest() {
        this.socket.emit('ride request', "You have a new ride request: <coordinates>")
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.mapStyle}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={this.state.region}
                    rotateEnabled={false}
                    //showsUserLocation={true}
                >
                    <Marker
                        coordinate={this.state.region}
                    >
                        <Image source={require('../assets/images/user.png')} style={{ height: 35, width: 35 }} />
                    </Marker>

                </MapView>

                {/* <MapViewDirections
                        origin={this.state.region}
                        destination={{latitude: 46.991595, longitude: -120.552111}}
                        apikey={KEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    /> */}

                <Button
                    title="Request"
                    onPress={(() => this.sendRideRequest())}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        flex: 1
    },
    button: {
        position: 'absolute',
        bottom: 1000
    }
});