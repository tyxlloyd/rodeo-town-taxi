import React from 'react';
import { StyleSheet, Dimensions, Alert, View, StatusBar, Linking } from 'react-native';
import { Header, Button, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import io from 'socket.io-client';

const config = require('./config').default

var KEY = config.mapKey;
var SERVER = config.server;

export class GlobalMap extends React.Component {
    mounted = false;
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.navigation.getParam('name'),
            taxiNumber: this.props.navigation.getParam('taxiNumber'),
            role: this.props.navigation.getParam('role'),
            phoneNumber: this.props.navigation.getParam('phoneNumber'),
            phoneNumberOfOtherUser: null,
            destination: null,
            region: {
                latitude: 47.0085,
                longitude: -120.5291,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045,
            },
            locationOfOtherUser: {
                latitude: 47.0085,
                longitude: -120.5291,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045,
            },
            mapArea: {
                latitude: 47.0085,
                longitude: -120.5291,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045,
            },
            markerVisibility: 0.0,
            driverAcceptedRequest: false,
            driverID: null,
            customerID: null,
            requestSent: false,
            buttonTitle: " ",
            failedToConnect: false,
            queueSize: 0,
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)

            var lastRegion = {
                latitude: lat,
                longitude: long,
                longitudeDelta: 0.045,
                latitudeDelta: 0.045
            }

            this.setState({region: lastRegion});

            if(this.state.role == 'driver'){
                this.setState({ mapArea: lastRegion })
                if(this.state.customerID != null){
                    var response = {
                        customerID: this.state.customerID,
                        driverLocation: this.state.region,
                    }
                    this.socket.emit('receive driver location', response);
                }
            }
            else{
                if(this.state.driverID != null){
                    var response = {
                        driverID: this.state.driverID,
                        customerLocation: this.state.region,
                    }
                    this.socket.emit('receive customer location', response);
                }
                else{
                    this.setState({mapArea: lastRegion});
                }
            }
        }, (error) => { Alert.alert(error.message) },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, }
        );

        if(this.state.role == 'driver'){
            this.setState({ buttonTitle: "Request A Customer" });
        }
        else {
            this.setState({ buttonTitle: "Hail A Cab" });
        }

        this.socket = io(SERVER);
        if(this.state.role == 'driver'){
            this.driverSocketListener();
        }
        else{
            this.customerSocketListener();
        }
    }

    callOtherUser(number) {
        var phoneNumber = '';
        if (Platform.OS == 'android') {
            phoneNumber = 'tel:${' + number + '}';
        }
        else {
            phoneNumber = 'telprompt:${' + number + '}';
        }
        Linking.openURL(phoneNumber);
    }

    componentWillUnmount() {
        this.mounted = false;
        navigator.geolocation.clearWatch(this.watchID);
    }

    driverSocketListener(){
        this.socket.on('connect_error', () => {
            if(this.state.failedToConnect == false){
                Alert.alert('Failed to connect to server', 'Please call Rodeo Town Taxi to hail a cab');
                this.setState({ failedToConnect: true });
                this.props.navigation.navigate('About');
            }
        });

        this.socket.on('ride request', request => {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + request.lat + ',' + request.long + '&key=' + KEY)
            .then((response) => response.json())
            .then((responseJson) => {
                Alert.alert('You have a new ride request!', request.name + " is waiting for you at:\n" + responseJson.results[0].formatted_address);
                this.setState({ buttonTitle: responseJson.results[0].formatted_address });
            });
            
            let destination = {
                latitude: request.lat,
                longitude: request.long,
            }

            this.setState({customerID: request.id});
            this.setState({destination: destination});
            this.setState({locationOfOtherUser: destination});
            this.setState({markerVisibility: 1.0});
            this.setState({ phoneNumberOfOtherUser: request.phoneNumber });
            var response = {
                customerID: this.state.customerID,
                driverLocation: this.state.region,
            }
            this.socket.emit('receive driver location', response);
        }),

        this.socket.on('queue size', message => {
            this.setState({ queueSize: message });
            if(this.state.customerID == null && this.mounted){
                this.setState({ buttonTitle: "Request A Customer\nCustomers In Line: " + this.state.queueSize })
            }
        }),

        this.socket.on('empty queue', message => {
            Alert.alert("Error", message);
        }),

        this.socket.on('receive customer location', message => {
            this.setState({locationOfOtherUser: message});
            this.setState({destination: message});
        }),

        this.socket.on('cancel ride', message => {
            Alert.alert(message, "Your customer has cancelled their ride request.");
            if(this.mounted){
                this.setState({ destination: null });
                this.setState({ markerVisibility: 0.0 });
                this.setState({ customerID: null });
                this.setState({ phoneNumberOfOtherUser: null });
                this.setState({ buttonTitle: "Request A Customer\nCustomers In Line: " + this.state.queueSize });
            }
        })
    }

    customerSocketListener(){
        this.socket.on('connect_error', () => {
            if(this.state.failedToConnect == false){
                Alert.alert('Failed to connect to server', 'Please call Rodeo Town Taxi to hail a cab');
                this.setState({ failedToConnect: true });
                this.props.navigation.navigate('About');
            }
        });

        this.socket.on('confirmation', message => {
            Alert.alert("Your taxi is on the way!", "Cab #" + message.taxiNumber + " is on its way to pick you up!");
            this.showDriverLocation(message.driverID);
            this.setState({ markerVisibility: 1.0 });
            this.setState({ driverID: message.driverID });
            this.setState({ driverAcceptedRequest: true });
            this.setState({ buttonTitle: "Cancel Request" });
            this.setState({ phoneNumberOfOtherUser: message.phoneNumber });
        }),

        this.socket.on('queue size', message => {
            this.setState({ queueSize: message });
            if(this.state.driverID == null && this.mounted){
                if(this.state.requestSent){
                    this.setState({ buttonTitle: "Finding A Driver...\nCustomers In Line: " + this.state.queueSize })
                }
                else{
                    this.setState({ buttonTitle: "Hail A Cab\nCustomers In Line: " + this.state.queueSize });
                }  
            }
        }),

        this.socket.on('receive driver location', message => {
            this.setState({ locationOfOtherUser: message });
            //this.setState({ destination: message });
            this.setState({ mapArea: message });
        }),

        this.socket.on('cancel ride', message => {
            Alert.alert(message, "Your driver has cancelled your ride request.");
            if(this.mounted){
                //this.setState({ destination: null });
                this.setState({ markerVisibility: 0.0 });
                this.setState({ driverID: null });
                this.setState({ mapArea: this.state.region });
                this.setState({ buttonTitle: "Hail A Cab\nCustomers In Line: " + this.state.queueSize});
                this.setState({ requestSent: false });
                this.setState({ phoneNumberOfOtherUser: null });
            }
        })
    }

    pressHandlerNumber() {
        if (this.state.role == 'driver') {
            if (this.state.customerID != null) {
                Alert.alert(
                    'Call Customer',
                    'Are you sure you would like to call the customer? This will end navigation.',
                    [
                        { text: 'Yes, call the customer', onPress: () => this.callOtherUser(this.state.phoneNumberOfOtherUser) },
                        {
                            text: 'No, do not call the customer',
                        },
                    ],
                    { cancelable: false },
                );
            }
            else {
                Alert.alert('You do not have a customer to call');
            }
        } else if (this.state.role == 'customer') {
            if (this.state.driverID != null) {
                Alert.alert(
                    'Call Driver',
                    'Are you sure you would like to call the driver?',
                    [
                        { text: 'Yes, call the driver', onPress: () => this.callOtherUser(this.state.phoneNumberOfOtherUser) },
                        {
                            text: 'No, do not call the driver',
                        },
                    ],
                    { cancelable: false },
                );
            }
            else {
                Alert.alert(
                    'You do not have a driver to call'
                );
            }
        }
    }

    pressHandler(){
        if(this.state.role == 'driver'){
            if(this.state.customerID != null){
                Alert.alert(
                    'End ride request',
                    'Are you sure you would like to end this ride request?',
                    [
                      {text: 'Yes, cancel this ride request', onPress: () => this.cancelCustomerRequest()},
                      {
                        text: 'No, do not cancel this ride request',
                      },
                    ],
                    {cancelable: false},
                  );
            }
            else{
                this.sendCustomerRequest();
            }
        }
        else{
            if(this.state.requestSent == false){
                this.sendRideRequest();
            }
            else{
                this.cancelRideRequest();
            }
        }
    }

    sendCustomerRequest(){
        var request= {
            taxiNumber: this.state.taxiNumber,
            id: this.socket.id,
            phoneNumber: this.state.phoneNumber,
        }
        this.socket.emit('customer request', request);
    }

    sendRideRequest() {
        if ( this.isNotInRangeFunction() )
        {
            Alert.alert("You are not in range of service!", "Try calling to see if we can pick you up!");
            this.props.navigation.navigate('About');
        }
        else{
            var request = {
                name: this.state.name,
                long: this.state.region.longitude,
                lat: this.state.region.latitude,
                id: this.socket.id,
                phoneNumber: this.state.phoneNumber,
            }
            this.socket.emit('ride request', request);
            Alert.alert("Your request has been sent!",
                "Please do not turn off your phone or close the app or you will lose your spot in line." );
            //this.setState({ buttonTitle: "Finding a driver..." });
            this.setState({ requestSent: true });
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

    cancelCustomerRequest(){
        this.socket.emit('cancel ride request', this.state.customerID);
        this.setState({ customerID: null });
        //this.setState({ destination: null });
        this.setState({ mapArea: this.state.region });
        this.setState({ buttonTitle: "Request A Customer\nCustomers In Line: " + this.state.queueSize });
        this.setState({ markerVisibility: 0.0 });
        this.setState({ destination: null });
        Alert.alert("You have cancelled your ride request");
    }

    cancelRideRequest(){
        if(this.state.driverID == null){
            Alert.alert("Please be patient", 
                "Your request will be processed in the order it was received. Please do not turn off your phone or close the app. You will lose your spot in line if you do.");
        }
        else{
            this.socket.emit('cancel ride request', this.state.driverID);
            this.setState({ driverID: null });
            this.setState({ markerVisibility: 0.0 });
            this.setState({ mapArea: this.state.region });
            this.setState({ driverAcceptedRequest: false });
            this.setState({ buttonTitle: "Hail A Cab\nCustomers In Line: " + this.state.queueSize });
            this.setState({ requestSent: false });
            Alert.alert("You have cancelled your ride request!");
        }
    }

    showDriverLocation(driverID) {
        var request = {
            customerID: this.socket.id,
            driverID: driverID,
        }
        this.socket.emit('get driver location', request);
    }

    navigateToChat(name, taxiNumber, role){
        this.props.navigation.navigate("DriverChat", { name, taxiNumber, role });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <Header
                    leftComponent={
                        <Icon name={'logout'}
                        size={28}
                          onPress={(() => this.props.navigation.navigate("URoles"))}/>
                    }
                    rightComponent={
                        <Icon name={'phone'}
                            size={28}
                            onPress={(() => this.pressHandlerNumber())} />
                    }
                    centerComponent={{ text: 'Rodeo Town Taxi', style: { color: '#000', fontFamily: 'arvo-regular', fontSize: 24 } }}
                    containerStyle={{backgroundColor: '#fec33a'}}
                />
                <MapView
                    style={styles.mapStyle}
                    provider={PROVIDER_GOOGLE}
                    region={this.state.mapArea}
                    rotateEnabled={true}
                    showsUserLocation={true}
                    loadingEnabled={true}
                >
                    <Marker
                        coordinate={this.state.locationOfOtherUser}
                        opacity={this.state.markerVisibility}
                        image={require('../assets/images/driver100.png')}
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
        //width: Dimensions.get('window').width,
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
