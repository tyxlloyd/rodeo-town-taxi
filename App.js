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

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './app/components/Home'
import CLogin from './app/components/CLogin'
import DLogin from './app/components/DLogin'
import ALogin from './app/components/ALogin'
import CMainScreen from './app/components/CMainScreen'
import DMainScreen from './app/components/DMainScreen'
import AMainScreen from './app/components/AMainScreen'

//each screen is a component/module


const RootStack = createStackNavigator({
  Home: HomeScreen,
  CustomerLogin: CLogin,
  CustomerMain: CMainScreen ,
  DriverLogin: DLogin,
  DriverMain: DMainScreen,
  AdminLogin: ALogin,
  AdminMain: AMainScreen
});

export default createAppContainer(RootStack);
