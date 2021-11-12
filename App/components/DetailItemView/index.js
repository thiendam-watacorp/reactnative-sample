import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from './styles';
import AppImage from '@ThemeImage'
import AppString from '@String'
import PropTypes from 'prop-types';

export default class DetailItemView extends React.PureComponent {

  render() {
    return (
      <View style = { this.props.styleFont == 1 ? styles.containerView : styles.containerViewNone}>
          <View style = {styles.containerTopView}>
            <Image style = {styles.appIcon} source = {this.props.iconName} />
            <Text style = {this.getStyle(this.props.styleFont)}>{this.props.buttonTitle}</Text>
          </View>
      </View>
    );
  }

  // Index 1: Title || Index 2: Value | Index 3: Website
  getStyle(index){
    if (index == 3) {
      return styles.hrefTitle
    } else {
      return this.props.styleFont == 1 ? styles.headerTitle : styles.headerTitleNone
    }
  }
}
DetailItemView.propTypes = {
  iconName: PropTypes.number,
  buttonTitle: PropTypes.string,
  styleFont: PropTypes.number
};
