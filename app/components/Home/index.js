import React, { Component } from 'react';
//import * as React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput

} from 'react-native';

import styles from './styles'


class HomeScreen extends React.Component {

    //hides header bar which can contain text
    static navigationOptions = {
        header: null
    }


    render() {


        const { navigate } = this.props.navigation
        return (
            <View style={styles.container}>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{'\nRodeo Town Taxi'}</Text>
                </View>
                
                <View style={styles.bodyTextContainer}>

                    <Text style={styles.bodyText}>{'Type of User'} </Text>
                </View>

                <View style={styles.buttonContainer}>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { navigate('CustomerLogin'); }}
                    >
                        <Text style={styles.buttonText}>Customer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { navigate('DriverLogin'); }}
                    >
                        <Text style={styles.buttonText}>Driver</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { navigate('AdminLogin'); }}
                    >
                        <Text style={styles.buttonText}>Administrator</Text>
                    </TouchableOpacity>


                </View>

            </View>

        );
    }
}


export default HomeScreen 