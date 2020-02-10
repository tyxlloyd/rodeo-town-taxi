import React, { useState } from 'react';
import AdminLogin from './screens/AdminLogin';
import AdminMain from './screens/AdminMain';
import CustomerLogin from './screens/CustomerLogin';
import CustomerMain from './screens/CustomerMain';
import Home from './screens/userHome';
import DriverLogin from './screens/DriverLogin';
import driverHome from './screens/driverHome';
import UserRoles from './screens/UserRoles';
import AddDriver from './screens/AddDriver';
import RemoveDriver from './screens/RemoveDriver';
import CustomerInfo from './screens/CustomerInfo';
import DriverInfo from './screens/DriverInfo';
import ModifyDriver from './screens/ModifyDriver';
import ForgotPassword from './screens/ForgotPassword';
import CustomerLoginAsGuest from './screens/CustomerLoginAsGuest';
import ApiKeys from './shared/ApiKeys';
import { Map } from './shared/map';
import Drawer from './routes/drawer'
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import * as firebase from 'firebase';
import '@firebase/firestore';
import userHome from './screens/userHome';


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
  DMain: driverHome,
  DInfo: DriverInfo,
  DModify: ModifyDriver,
  ALogin: AdminLogin,
  AMain: AdminMain,
  AddDriver: AddDriver,
  RemoveDriver: RemoveDriver,
  ForgotPassword: ForgotPassword,
  Map: Map,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

export default class App extends React.Component {
  render() {
    return <AppNavigator />
  } 
}