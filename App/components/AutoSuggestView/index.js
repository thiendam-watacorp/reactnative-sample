import React from 'react';
import { View ,TouchableOpacity, Image, Button, TextInput,FlatList } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import AppImage from '@ThemeImage';
import ThemeColor from '@ThemeColor';
import CommonUtils from '@CommonUtils';
import { connect } from 'react-redux';
import { Dropdown } from 'react-native-material-dropdown';

class AutoSuggestView extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {

    };
  }
  onPressItem(){
    this.props.onPressItem(this.props.item);
  }
  render() {
    let elem = this.props.item['place_name'] ? this.props.item['place_name'] : this.props.item;
    return (
       <TouchableOpacity style = {this.props.islastItem ? styles.itemParentViewLastItem : styles.itemParentView}
        onPress={() => this.onPressItem()}>
          <View style = {styles.leftView}>
           <Text style = {styles.TextStyle}>{elem}</Text>
         </View>
         <View style = {styles.rightView}>
          <Image style={styles.iconStyles} source={AppImage.icon_Dropdown} />
          </View>
       </TouchableOpacity>
    );
  }
}
export default AutoSuggestView;
