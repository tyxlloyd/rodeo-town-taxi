import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Header({ navigation, title }) {
    const openMenu = () => {
        navigation.openDrawer();
    }

    return (
        <View style = {styles.header}>
            <MaterialIcons name = 'menu' size = {28} onPress = {openMenu} style = {styles.icon}/>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },

    icon: {
        position: 'absolute',
        left: 16,
        //paddingRight: 340,
    },
})