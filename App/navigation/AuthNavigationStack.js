import { createStackNavigator } from 'react-navigation';

import StartScreen from '@Screen/StartScreen';
import MapScreen from '@Screen/MapScreen';

const AuthStack = createStackNavigator(
  {
    Login: { screen: MapScreen }
  },
  {
    header: null,
    headerMode: 'none',
    navigationOptions: {
      header: null
    }
  });
export default AuthStack;
