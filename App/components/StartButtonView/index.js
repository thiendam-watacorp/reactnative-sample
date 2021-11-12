import React from 'react';
import { View, TouchableOpacity, Image, Button } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import AppImage from '@ThemeImage'
import ThemeColor from '@ThemeColor';

export default class StartButtonView extends React.PureComponent {

  render() {
    return (
      <TouchableOpacity onPress={() => this.props.doActionClicked()} style={[styles.containerViewStyle, { backgroundColor: this.props.backgroundButton }, { borderColor: this.props.borderColor }, { borderWidth: this.props.borderWidth }]} >
        <Image style={styles.ImageIconStyle} source={this.props.iconName} />
        <Text style={[styles.TextStyle, { color: this.props.buttonTitleColor }]}>{this.props.buttonTitle}</Text>
      </TouchableOpacity>
    );
  }
}

StartButtonView.propTypes = {
  doActionClicked: PropTypes.func,
  iconName: PropTypes.number,
  buttonTitle: PropTypes.string,
  backgroundButton: PropTypes.string,
  buttonTitleColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
};

StartButtonView.defaultProps = {
  defaultTitleButtonColor: true,
  borderWidth: 0,
  buttonTitleColor: ThemeColor.WhiteColor
}
