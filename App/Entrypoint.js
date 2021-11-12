import React, { Component,Text } from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import Navigator from 'App/navigation';
import configureStore from 'App/store/configureStore';
import SplashScreen from 'react-native-splash-screen';
import PropTypes from 'prop-types';

const { persistor, store } = configureStore();

export default class Entrypoint extends Component {
    componentDidMount() {
        SplashScreen.hide()
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate
                    loading={<ActivityIndicator />}
                    persistor={persistor}
                >
                    <Navigator />
                </PersistGate>
            </Provider>
        );
    }
}

