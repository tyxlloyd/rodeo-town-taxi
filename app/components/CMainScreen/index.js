import React, { Component } from 'react';
//import * as React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    TextInput

} from 'react-native';
import styles from './styles'


class CMainScreen extends React.Component {

    static navigationOptions = {
        header: null
    }
    render() {
        const { navigate } = this.props.navigation
        return (


            <View style={styles.container}>
                
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{'\nWelcome Customer'}</Text>

                </View>



            </View>

        );
    }
}


export default CMainScreen