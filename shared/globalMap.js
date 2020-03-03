import React from 'react';
import { StyleSheet, Dimensions, Alert, View, StatusBar, Linking } from 'react-native';
import { Header, Button, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import io from 'socket.io-client';

const config = require('./config').default

var KEY = config.mapKey; // The Google Maps API key
var SERVER = config.server; // The URL of the App Engine running the server code

export class GlobalMap extends React.Component {
    mounted = false;
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.navigation.getParam('name'), // Customer name
            taxiNumber: this.props.navigation.getParam('taxiNumber'), // Driver's cab number
            role: this.props.navigation.getParam('role'), // 'customer' or 'driver'
            phoneNumber: this.props.navigation.getParam('phoneNumber'),
            phoneNumberOfOtherUser: null, // Gets set when a ride request is accepted
            destination: null, // The destination for react-native-maps-directions
            region: { // A starting point for the map. This is initially set to Ellensburg
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
            mapArea: { // When this changes, the map will automatically scroll
                latitude: 47.0085,
                longitude: -120.5291,
                latitudeDelta: 0.045,
                longitudeDelta: 0.045,
            },
            markerVisibility: 0.0, // For showing where the other user is
            driverAcceptedRequest: false,
            driverID: null, // The socket id of the driver
            customerID: null, // The socket id of the customer
            requestSent: false, // If the customer has a request in the queue already
            buttonTitle: " ", // The text for the grey button at the bottom
            failedToConnect: false, // If a connection to the server cannot be established
            queueSize: 0, // How many customers are waiting in the queue
        }
    }

    componentDidMount() {
        this.mounted = true;

        // This function gets the location of the user
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)

            var lastRegion = {
                latitude: lat,
                longitude: long,
                longitudeDelta: 0.045,
                latitudeDelta: 0.045
            }

            // Set the current location of the user
            this.setState({region: lastRegion});

            // If they are a driver, the map will focus on their location
            if(this.state.role == 'driver'){
                this.setState({ mapArea: lastRegion })

                // If they have a customer assigned to them, send the customer their location
                if(this.state.customerID != null){
                    var response = {
                        customerID: this.state.customerID,
                        driverLocation: this.state.region,
                    }
                    this.socket.emit('receive driver location', response);
                }
            }
            else{
                // If they are a customer and they have a driver assigned to them,
                // send the driver their location
                if(this.state.driverID != null){
                    var response = {
                        driverID: this.state.driverID,
                        customerLocation: this.state.region,
                    }
                    this.socket.emit('receive customer location', response);
                }
                // If they are a customer and they do not have a driver assigned to them,
                // focus the map on their location
                else{
                    this.setState({mapArea: lastRegion});
                }
            }
        }, (error) => { Alert.alert(error.message) },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, }
        );

        // Sets the default text of the grey button depending on user role
        if(this.state.role == 'driver'){
            this.setState({ buttonTitle: "Request A Customer" });
        }
        else {
            this.setState({ buttonTitle: "Hail A Cab" });
        }

        // Connect to the server
        this.socket = io(SERVER);
        if(this.state.role == 'driver'){
            this.driverSocketListener();
        }
        else{
            this.customerSocketListener();
        }
    }

    // Dial the other user's phone number
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

    // All of the events that a driver would need to listen for
    driverSocketListener(){

        // If a connection to the server cannot be established
        this.socket.on('connect_error', () => {
            if(this.state.failedToConnect == false){
                Alert.alert('Failed to connect to server', 'Please call Rodeo Town Taxi to hail a cab');
                this.setState({ failedToConnect: true });
                this.props.navigation.navigate('About');
            }
        });

        // If the driver is assigned a customer after pressing the grey button
        this.socket.on('ride request', request => {
            // Convert coordinates to a readable address
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + request.lat + ',' + request.long + '&key=' + KEY)
            .then((response) => response.json())
            .then((responseJson) => {
                Alert.alert('You have a new ride request!', request.name + " is waiting for you at:\n" + responseJson.results[0].formatted_address);
                this.setState({ buttonTitle: responseJson.results[0].formatted_address });
            });
            
            // destination = customer's location
            let destination = {
                latitude: request.lat,
                longitude: request.long,
            }

            this.setState({customerID: request.id}); // Socket id of customer
            this.setState({destination: destination}); // destination = customer's location, used for react-native-maps-directions
            this.setState({locationOfOtherUser: destination}); // locationOfOtherUser = customer's location
            this.setState({markerVisibility: 1.0}); // Show the destination marker on the map
            this.setState({ phoneNumberOfOtherUser: request.phoneNumber }); // Save the customer's phone number

            // Driver's current location
            var response = {
                customerID: this.state.customerID,
                driverLocation: this.state.region,
            }
            this.socket.emit('receive driver location', response); // Send driver location to customer
        }),

        // Shows how many customers are waiting in line
        this.socket.on('queue size', message => {
            this.setState({ queueSize: message });
            if(this.state.customerID == null && this.mounted){
                this.setState({ buttonTitle: "Request A Customer\nCustomers In Line: " + this.state.queueSize })
            }
        }),

        // If the driver requests a customer while the queue is empty
        this.socket.on('empty queue', message => {
            Alert.alert("Error", message);
        }),

        // Update the map to the customer's location
        this.socket.on('receive customer location', message => {
            this.setState({locationOfOtherUser: message});
            this.setState({destination: message});
        }),

        // If the customer cancels their ride request, reset all variables to their default state
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

    // All of the events that a customer would need to listen for
    customerSocketListener(){

        // If a connection to the server cannot be established
        this.socket.on('connect_error', () => {
            if(this.state.failedToConnect == false){
                Alert.alert('Failed to connect to server', 'Please call Rodeo Town Taxi to hail a cab');
                this.setState({ failedToConnect: true });
                this.props.navigation.navigate('About');
            }
        });

        // If a driver accepts their ride request
        this.socket.on('confirmation', message => {
            Alert.alert("Your taxi is on the way!", "Cab #" + message.taxiNumber + " is on its way to pick you up!");
            this.setState({ markerVisibility: 1.0 });// Show driver location on the map
            this.setState({ driverID: message.driverID }); // Save driver's socket id
            this.setState({ driverAcceptedRequest: true }); // Used if the customer wants to cancel the request
            this.setState({ buttonTitle: "Cancel Request" });
            this.setState({ phoneNumberOfOtherUser: message.phoneNumber }); // Save the driver's phone number
        }),

        // Show how many customers are waiting in line
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

        // Update the map based on the driver's current location
        this.socket.on('receive driver location', message => {
            this.setState({ locationOfOtherUser: message });
            this.setState({ mapArea: message });
        }),

        // If the driver cancels the request, reset the map to its default state
        this.socket.on('cancel ride', message => {
            Alert.alert(message, "Your driver has cancelled your ride request.");
            if(this.mounted){
                this.setState({ markerVisibility: 0.0 });
                this.setState({ driverID: null });
                this.setState({ mapArea: this.state.region });
                this.setState({ buttonTitle: "Hail A Cab\nCustomers In Line: " + this.state.queueSize});
                this.setState({ requestSent: false });
                this.setState({ phoneNumberOfOtherUser: null });
            }
        })
    }

    // If the user presses the phone icon
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

    // Change functionality depending on role and whether or not they have a pending ride request
    pressHandler(){
        if(this.state.role == 'driver'){
            // If the driver has accepted a request
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
            // If the driver has not accepted a request
            else{
                this.sendCustomerRequest();
            }
        }
        else{
            // If the customer has not sent a request
            if(this.state.requestSent == false){
                this.sendRideRequest();
            }
            else{
                this.cancelRideRequest();
            }
        }
    }

    // Lets the driver accept a ride request
    sendCustomerRequest(){
        // request will be sent to the customer that requested the ride
        var request= {
            taxiNumber: this.state.taxiNumber,
            id: this.socket.id,
            phoneNumber: this.state.phoneNumber,
        }
        this.socket.emit('customer request', request);
    }

    // Lets the customer hail a cab
    sendRideRequest() {
        if ( this.isNotInRangeFunction() ) // Check if the customer is in the Rodeo Town service area
        {
            Alert.alert("You are not in range of service!", "Try calling to see if we can pick you up!");
            this.props.navigation.navigate('About');
        }
        else{
            // Send this information to the queue, which will be sent to the driver who accepts it
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
            this.setState({ requestSent: true });
        }
    }

    //Checks if the GPS location is within range of service.
    isNotInRangeFunction = () => {
        const MAX_NORTHING = 47.141943;
        const MIN_NORTHING = 46.80;
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

    // Lets the driver cancel the ride request
    cancelCustomerRequest(){
        this.socket.emit('cancel ride request', this.state.customerID);
        this.setState({ customerID: null });
        this.setState({ mapArea: this.state.region });
        this.setState({ buttonTitle: "Request A Customer\nCustomers In Line: " + this.state.queueSize });
        this.setState({ markerVisibility: 0.0 });
        this.setState({ destination: null });
        Alert.alert("You have cancelled your ride request");
    }

    // Lets the customer cancel the ride request
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