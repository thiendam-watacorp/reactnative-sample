import React from 'react';
import { Text, View, Image ,TouchableOpacity} from 'react-native';
import styles from './styles';
import AppImage from '@ThemeImage'
import AppString from '@String'
import CommonUtils from '@CommonUtils'

export default class HeaderDetailView extends React.PureComponent {

  render() {
    const item = this.props.item
    return (
      <View style = { CommonUtils.isTabletAndroid() ? styles.containerViewTabletAndroid : styles.containerView}>
        <View style = {styles.container}>
            <TouchableOpacity style = {styles.containerSlide} onPress={() => this.props.onBackItem()}>
              <Image style = {styles.ImageIconStyle} source = {AppImage.ic_back} />
            </TouchableOpacity>
            <View style = {{width:1,height:'100%',backgroundColor:'#C8C9C7'}}/>
            <View style = {styles.centerView}>
                    <Text style = {styles.headerTitle}>{AppString.detail_dealer_string}</Text>
            </View>
            <View style = {{width:1,height:'100%',backgroundColor:'#C8C9C7'}} />
            <TouchableOpacity style = {styles.containerSlide} onPress={() => this.props.onShareItem(item)}>
              <Image style = {styles.ImageIconStyle} source = {AppImage.icon_Share} />
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}
