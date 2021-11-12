import { createStackNavigator } from 'react-navigation';
import HomeScreen from '@Screen/Home';
import StartScreen from '@Screen/StartScreen';
import AssitanceScreen from '@Screen/AssitanceScreen';
import ListScreen from '@Screen/ListScreen';
import MapScreen from '@Screen/MapScreen';
import DetailItemScreen from '@Screen/DetailItemScreen';
import RoutingScreen from '@Screen/RoutingScreen';
import { Animated,Easing } from 'react-native';

let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0]
  })
  const slideFromRight = { transform: [{ translateX }] }
  return slideFromRight
};

const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 250,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        default: SlideFromRight(index, position, width),
      }[transition];
    },
  }
}


const AppStack = createStackNavigator({

  HomeScreen: { screen: HomeScreen },
  MapScreen:{screen:MapScreen},
  ListScreen: { screen: ListScreen },
  AssitanceScreen:{screen:AssitanceScreen},
  DetailItemScreen:{screen:DetailItemScreen},
  RoutingScreen:{screen:RoutingScreen}
},
  {
    header: null,
    headerMode: 'none',
    // mode: Platform.OS === "ios" ? "modal" : "card",
    // transitionConfig: TransitionConfiguration,
    navigationOptions: {
      header: null
    }
  }, {
    initialRouteName: 'HomeScreen',
  });

export default AppStack;
