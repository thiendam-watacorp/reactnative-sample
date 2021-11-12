import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import AppImage from '@ThemeImage'

class InitScreenContainer extends Component {
  constructor() {
    super();
    this.state = {
      isUpdating: false,
    };
  }
  componentDidMount() {
    this.props.navigation.navigate('HomeScreen');
  }

  render() {
    return (
      <View style={styles.backgroundImage} >
        <View style={styles.containView}>
        <Text style={{ textAlign: 'center', alignContent: 'center', bottom: 5, height: this.state.isUpdating ? 30 : 0 }}>Get new dealers list...</Text>
        </View>
      </View>
    );

  }
}
export default InitScreenContainer