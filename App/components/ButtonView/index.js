import React from 'react';
import { View, TouchableOpacity,Image,Button } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import AppImage from '@ThemeImage';
import ThemeColor from '@ThemeColor';

export default class ButtonView extends React.PureComponent {

  render() {
    const textColor = this.props.buttonColor ? this.props.buttonColor : ThemeColor.WHITE
    if (this.props.isDetailButton) {
      return (
        <TouchableOpacity  onPress={() => this.props.doActionClicked()} style={[styles.containerViewStyle,{backgroundColor:this.props.backgroundButton}]} >
        <View style = { styles.containerOtherView} >
          <Image style = {styles.ImageIconStyle} source = {this.props.iconName} />
        </View>
        <Text style = {[styles.TextStyle,{color : textColor}]}>{this.props.buttonTitle}</Text>
        <View/>
     </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity  onPress={() => this.props.doActionClicked()} style={[styles.containerViewStyle,{backgroundColor:this.props.backgroundButton}]} >
            <View style = { styles.containerOtherView} >
              <Image style = {styles.ImageIconStyle} source = {this.props.iconName} />
            </View>
            <View style = { styles.leftcontainerOtherView} ></View>
            <View/>
            <Text style = {[styles.DetailTextStyle,{color : textColor}]}>{this.props.buttonTitle}</Text>
         </TouchableOpacity>
      );
    }
  }
}

ButtonView.propTypes = {
  doActionClicked: PropTypes.func,
  iconName: PropTypes.number,
  buttonTitle: PropTypes.string,
  backgroundButton: PropTypes.string,
  buttonColor: PropTypes.string,
  isDetailButton: PropTypes.bool
};

ButtonView.defaultProps = {
  isDetailButton : false,
}
