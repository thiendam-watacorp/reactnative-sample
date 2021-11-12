import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import InitScreen from '@Screen/InitScreen';
import AuthStack from './AuthNavigationStack';
import AppStack from './AppNavigationStack';

const switchNavigation = createSwitchNavigator(
  { InitScreen: InitScreen, App: AppStack},
  { initialRouteName: 'InitScreen', }
)


export default createAppContainer(switchNavigation);
