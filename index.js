import { AppRegistry } from 'react-native';
import Entrypoint from './App/Entrypoint';
import { name as appName } from './app.json';
import { Text,TextInput } from 'react-native';
AppRegistry.registerComponent(appName, () => Entrypoint);
Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false };
TextInput.defaultProps = { ...(TextInput.defaultProps || {}), allowFontScaling: false };


