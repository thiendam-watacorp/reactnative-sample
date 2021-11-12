import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from './styles';
import AppImage from '@ThemeImage'
import AppString from '@String'

export default class HeaderTableView extends React.PureComponent {

  render() {
    return (
      <View style = {styles.containerView}>
          <View style = {styles.containerTopView}>
            <Image style = {styles.appIcon} source = {AppImage.icon_ListDetail} />
            <Text style = {styles.headerTitle}>{AppString.list_string}</Text>
          </View>
      </View>
    );
  }
}
