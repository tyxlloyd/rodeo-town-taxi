import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home';
import About from '../screens/about';

const RootDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: Home,
    },

    About: {
        screen: About,
    }
});

export default createAppContainer(RootDrawerNavigator);