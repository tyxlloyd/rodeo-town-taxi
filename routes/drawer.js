import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home';
import About from '../screens/about';
import Account from '../screens/account';

/*
import HomeStack from './homeStack';
import AboutStack from './aboutStack';
*/

const RootDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: Home,
    },

    About: {
        screen: About,
    },

    Account: {
        screen: Account,
    }
});

export default createAppContainer(RootDrawerNavigator);