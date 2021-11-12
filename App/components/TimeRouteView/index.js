import React from 'react';
import { View, TouchableOpacity, Image, Button, TextInput } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import AppImage from '@ThemeImage';
import ThemeColor from '@ThemeColor';
import CommonUtils from '@CommonUtils';
import AppString from '@String';

export default class TimeRouteView extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  goToMapDirection() {
    if (this.props.startLocation && this.props.endLocation) {
      const startCoordinate = this.props.startLocation.latitude + "," + this.props.startLocation.longitude;
      const endCoordinate = this.props.endLocation.latitude + "," + this.props.endLocation.longitude;
      CommonUtils.openMap(startCoordinate, endCoordinate);
    }
  }

  render() {
    return (
      <View style={styles.containerViewStyle}>
        <View style={styles.containParrentTopView}>
          <View style={styles.containTopView}>
            <View style={styles.containerOtherView} >
              <Image style={styles.ImageIconStyle} source={AppImage.ic_Time} />
            </View>
            <Text numberOfLines={1} style={styles.TextStyle}>{this.props.DurationTime}</Text>
            <View style={styles.rightTopView} >
              <Text style={styles.TextStyleDistance}>{this.props.Distance}</Text>
            </View>
          </View>

        </View>
        <View style={styles.containParrentTopViewNoneBorder}>
        <TouchableOpacity onPress={() => this.goToMapDirection() } style={styles.containerRightButtonViewStyle}>
            <Text style = {styles.TextStyleStartAction}>START</Text>
         </TouchableOpacity>
        </View>
      </View>
    );
  }
}

TimeRouteView.propTypes = {
  DurationTime: PropTypes.string,
  Distance: PropTypes.string,
  startLocation: PropTypes.any,
  endLocation: PropTypes.any,
};

TimeRouteView.defaultProps = {
  DurationTime: "0 minute",
  Distance: "0 mile",
}