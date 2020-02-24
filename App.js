import React, { useState } from 'react';
import AdminLogin from './screens/AdminLogin';
import AdminMain from './screens/AdminMain';
import CustomerLogin from './screens/CustomerLogin';
import CustomerMain from './screens/CustomerMain';
import DriverLogin from './screens/DriverLogin';
import UserRoles from './screens/UserRoles';
import AddDriver from './screens/AddDriver';
import RemoveDriver from './screens/RemoveDriver';
import CustomerInfo from './screens/CustomerInfo';
import DriverInfo from './screens/DriverInfo';
import ModifyDriver from './screens/ModifyDriver';
import ForgotPassword from './screens/ForgotPassword';
import CustomerLoginAsGuest from './screens/CustomerLoginAsGuest';
import ApiKeys from './shared/ApiKeys';
import { CustomerMap } from './shared/map';
import { DriverMap } from './shared/driverMap';
import { GlobalMap } from './shared/globalMap';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import * as firebase from 'firebase';
import '@firebase/firestore';
import * as Font from 'expo-font';
import DriverMain from './screens/DriverMain';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(ApiKeys.firebaseConfig);
}

const AppSwitchNavigator = createSwitchNavigator({
  URoles: UserRoles,
  CLogin: CustomerLogin,
  CGuest: CustomerLoginAsGuest,
  CMain: CustomerMain,
  CInfo: CustomerInfo,
  DLogin: DriverLogin,
  DMain: DriverMain,
  DInfo: DriverInfo,
  DModify: ModifyDriver,
  ALogin: AdminLogin,
  AMain: AdminMain,
  AddDriver: AddDriver,
  RemoveDriver: RemoveDriver,
  ForgotPassword: ForgotPassword,
  CustomerMap: CustomerMap,
  DriverMap: DriverMap,
  GlobalMap: GlobalMap,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

export default class App extends React.Component {
  componentDidMount(){
    Font.loadAsync({
      'arvo-regular': require('./assets/fonts/Arvo-Regular.ttf'),
      'arvo-bold': require('./assets/fonts/Arvo-Bold.ttf'),
    });
  }
  render() {
    return <AppNavigator />
  } 
}